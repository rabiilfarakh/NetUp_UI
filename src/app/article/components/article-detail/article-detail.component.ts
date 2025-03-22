import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleDTORes } from '../../model/article.model';
import { ArticleService } from '../../services/article.service';
import { CommentService } from '../../../comment/service/comment.service';
import { CommentDTOReq, CommentDTORes } from '../../../comment/model/comment.model';
import { AuthService } from '../../../users/auth/service/auth.service';

@Component({
  selector: 'app-article-detail',
  standalone: false,
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css'
})
export class ArticleDetailComponent implements OnInit {
  article: ArticleDTORes | null = null;
  newComment: string = '';
  currentUserId: string | null = null;
  editingCommentId: number | null = null;
  editCommentText: string = '';
  showDeleteConfirmation: boolean = false;
  commentToDeleteId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private commentService: CommentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserIdFromToken();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.articleService.getArticleById(+id).subscribe({
        next: (article) => {
          this.article = article;
          console.table(article);
          this.loadComments(+id); 
        },
        error: (err) => console.error('Error loading article:', err)
      });
    }
  }

  loadComments(articleId: number): void {
    this.commentService.getCommentsByArticleId(articleId).subscribe({
      next: (comments) => {
        if (this.article) {
          this.article.comments = comments.map(comment => ({
            ...comment,
            articleDTOCom: {
              ...comment,
              user: {
                ...comment.user,
                photo: comment.user.photo || 'default-user.png'
              }
            }
          }));
        }
      },
      error: (err) => console.error('Error loading comments:', err)
    });
  }

  addComment(): void {
    if (!this.newComment.trim() || !this.article) {
      console.log('Comment or article is empty');
      return;
    }

    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      console.error('Utilisateur non connecté');
      return;
    }

    const currentDate = new Date().toISOString();
    const commentRequest: CommentDTOReq = {
      description: this.newComment,
      article_id: this.article.id,
      date: currentDate,
      user_id: userId
    };
    
    console.log(commentRequest);

    this.commentService.createComment(commentRequest).subscribe({
      next: (newCommentRes: CommentDTORes) => {
        console.log('Comment added:', newCommentRes);
        if (!this.article!.comments) {
          this.article!.comments = [];
        }
        this.article!.comments.push(newCommentRes);
        this.newComment = ''; 
      },
      error: (error) => {
        console.error('Error adding comment:', error);
      }
    });
  }

  // Vérifier si l'utilisateur est l'auteur du commentaire
  isCommentAuthor(comment: CommentDTORes): boolean {
    return this.currentUserId === comment.user.id.toString();
  }

  // Commencer l'édition d'un commentaire
  startEditComment(comment: CommentDTORes): void {
    this.editingCommentId = comment.id;
    this.editCommentText = comment.description;
  }

  // Annuler l'édition d'un commentaire
  cancelEditComment(): void {
    this.editingCommentId = null;
    this.editCommentText = '';
  }

  // Sauvegarder les modifications d'un commentaire
  saveEditComment(comment: CommentDTORes): void {
    if (!this.editCommentText.trim() || !this.article) {
      return;
    }

    const updatedComment: CommentDTOReq = {
      description: this.editCommentText,
      article_id: this.article.id,
      user_id: comment.user.id.toString()
    };

    this.commentService.updateComment(comment.id, updatedComment).subscribe({
      next: (updatedCommentRes) => {
        console.log('Comment updated:', updatedCommentRes);
        if (this.article && this.article.comments) {
          const index = this.article.comments.findIndex(c => c.id === comment.id);
          if (index !== -1) {
            this.article.comments[index] = {
              ...this.article.comments[index],
              description: this.editCommentText
            };
          }
        }
        this.editingCommentId = null;
        this.editCommentText = '';
      },
      error: (error) => {
        console.error('Error updating comment:', error);
      }
    });
  }

  // Confirmer la suppression d'un commentaire
  confirmDeleteComment(commentId: number): void {
    this.commentToDeleteId = commentId;
    this.showDeleteConfirmation = true;
  }

  // Annuler la suppression d'un commentaire
  cancelDeleteComment(): void {
    this.commentToDeleteId = null;
    this.showDeleteConfirmation = false;
  }

  // Supprimer un commentaire
  deleteComment(): void {
    if (!this.commentToDeleteId) {
      return;
    }

    this.commentService.deleteComment(this.commentToDeleteId).subscribe({
      next: () => {
        console.log('Comment deleted');
        if (this.article && this.article.comments) {
          this.article.comments = this.article.comments.filter(
            comment => comment.id !== this.commentToDeleteId
          );
        }
        this.commentToDeleteId = null;
        this.showDeleteConfirmation = false;
      },
      error: (error) => {
        console.error('Error deleting comment:', error);
      }
    });
  }

  // Gérer les erreurs d'image
  handleImageError(event: any): void {
    event.target.src = '/assets/img/default-user.png';
  }
}