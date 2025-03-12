import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleDTORes } from '../../model/article.model';
import { ArticleService } from '../../services/article.service';
import { CommentService } from '../../../comment/service/comment.service';
import { CommentDTOReq, CommentDTORes } from '../../../comment/model/comment.model';


@Component({
  selector: 'app-article-detail',
  standalone: false,
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css'
})
export class ArticleDetailComponent implements OnInit {
  article: ArticleDTORes | null = null;
  newComment: string = '';

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.articleService.getArticleById(+id).subscribe({
        next: (article) => {
          this.article = article;
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
          this.article.comments = comments;
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

    const currentDate = new Date().toISOString();
    const commentRequest: CommentDTOReq = {
      description: this.newComment,
      article_id: this.article.id,
      date: currentDate
    };

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
}