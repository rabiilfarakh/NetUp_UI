import { Component , OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleDTORes } from '../../model/article.model';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-article-detail',
  standalone: false,
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css'
})
export class ArticleDetailComponent implements OnInit {
  article: ArticleDTORes | null = null;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.articleService.getArticleById(+id).subscribe(article => {
        this.article = article;
      });
    }
  }
}
