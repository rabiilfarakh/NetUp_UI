import { Component, type OnInit } from "@angular/core"

import type { ArticleDTORes } from "../../model/article.model"
import { trigger, transition, style, animate, state } from "@angular/animations"
import { ArticleService } from "../../services/article.service"

@Component({
  standalone: false,
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],

  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ height: 0, opacity: 0 }),
        animate("300ms ease-out", style({ height: "*", opacity: 1 })),
      ]),
      transition(":leave", [
        style({ height: "*", opacity: 1 }),
        animate("300ms ease-in", style({ height: 0, opacity: 0 })),
      ]),
    ]),
    trigger("fadeIn", [
      transition(":enter", [style({ opacity: 0 }), animate("600ms ease-out", style({ opacity: 1 }))]),
    ]),
    trigger("fadeInUp", [
      transition(":enter", [
        style({ transform: "translateY(20px)", opacity: 0 }),
        animate("600ms ease-out", style({ transform: "translateY(0)", opacity: 1 })),
      ]),
    ]),
    trigger("float", [
      state("void", style({ transform: "translateY(0)" })),
      state("*", style({ transform: "translateY(0)" })),
      transition(":enter", [
        style({ transform: "translateY(10px)", opacity: 0 }),
        animate("800ms ease-out", style({ transform: "translateY(0)", opacity: 1 })),
      ]),
      transition("* => *", [
        animate("3000ms ease-in-out", style({ transform: "translateY(-10px)" })),
        animate("3000ms ease-in-out", style({ transform: "translateY(10px)" })),
      ]),
    ]),
    trigger("expandCollapse", [
      transition(":enter", [
        style({ height: "0", opacity: 0 }),
        animate("300ms ease-out", style({ height: "*", opacity: 1 })),
      ]),
      transition(":leave", [
        style({ height: "*", opacity: 1 }),
        animate("300ms ease-in", style({ height: "0", opacity: 0 })),
      ]),
    ]),
    trigger("cardAnimation", [
      transition(":enter", [
        style({ transform: "translateY(30px)", opacity: 0 }),
        animate("{{delay}}ms 300ms ease-out", style({ transform: "translateY(0)", opacity: 1 })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  articles: ArticleDTORes[] = []
  filteredArticles: ArticleDTORes[] = []
  loading = false
  error: string | null = null
  likes: { [key: number]: number } = {}
  likedArticles: Set<number> = new Set()
  comments: { [key: number]: string[] } = {}
  newComment: { [key: number]: string } = {}
  showComments: { [key: number]: boolean } = {}
  mobileMenuOpen = false
  darkMode = false
  searchTerm = ""
  sortOption = "recent"
  currentPage = 1
  itemsPerPage = 6
  totalPages = 1
  currentYear = new Date().getFullYear()

  navItems = [
    { name: "Accueil", url: "/", active: true },
    { name: "Articles", url: "/articles", active: false },
    { name: "Catégories", url: "/categories", active: false },
    { name: "À propos", url: "/about", active: false },
    { name: "Contact", url: "/contact", active: false },
  ]

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles()
    // Vérifier si le mode sombre est enregistré dans localStorage
    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode) {
      this.darkMode = savedDarkMode === "true"
    } else {
      // Vérifier les préférences du système
      this.darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    }
  }

  loadArticles(): void {
    if (!this.articleService) {
      this.error = "Service d'articles non disponible"
      this.loading = false
      return
    }
    this.loading = true
    this.articleService.getAllArticles().subscribe({
      next: (articles) => {
        // Enrichir les articles avec des données supplémentaires pour la démo
        this.articles = articles.map((article) => ({
          ...article,
          category: this.getRandomCategory(),
          imageUrl: `https://source.unsplash.com/random/800x600?blog,${article.id}`,
          author: {
            name: this.getRandomAuthorName(),
            avatar: `https://i.pravatar.cc/150?u=${article.id}`,
          },
        }))

        this.articles.forEach((article) => {
          this.likes[article.id] = Math.floor(Math.random() * 50)
          this.comments[article.id] = this.generateRandomComments()
          this.newComment[article.id] = ""
          this.showComments[article.id] = false
        })

        this.applyFilters()
        this.loading = false
      },
      error: (err) => {
        this.error = "Erreur lors du chargement des articles"
        this.loading = false
        console.error(err)
      },
    })
  }

  applyFilters(): void {
    let filtered = [...this.articles]

    // Appliquer la recherche
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim()
      filtered = filtered.filter(
        (article) => article.title.toLowerCase().includes(search) || article.description.toLowerCase().includes(search),
      )
    }

    // Appliquer le tri
    filtered = this.sortArticlesArray(filtered)

    // Calculer la pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage)

    // Appliquer la pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    this.filteredArticles = filtered.slice(startIndex, startIndex + this.itemsPerPage)
  }

  // Méthode modifiée pour corriger l'erreur de type
  sortArticles(): void {
    this.applyFilters()
  }

  // Nouvelle méthode qui retourne un tableau trié
  sortArticlesArray(articles: ArticleDTORes[]): ArticleDTORes[] {
    switch (this.sortOption) {
      case "popular":
        return [...articles].sort((a, b) => (this.likes[b.id] || 0) - (this.likes[a.id] || 0))
      case "comments":
        return [...articles].sort((a, b) => (this.comments[b.id]?.length || 0) - (this.comments[a.id]?.length || 0))
      case "recent":
      default:
        return [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  }

  likeArticle(articleId: number): void {
    if (this.likedArticles.has(articleId)) {
      this.likes[articleId]--
      this.likedArticles.delete(articleId)
    } else {
      this.likes[articleId] = (this.likes[articleId] || 0) + 1
      this.likedArticles.add(articleId)
    }
  }

  isLiked(articleId: number): boolean {
    return this.likedArticles.has(articleId)
  }

  // Modification de la méthode addComment pour éviter l'utilisation de l'opérateur de chaînage optionnel
  addComment(articleId: number): void {
    const commentText = this.newComment[articleId] || ""
    const comment = commentText.trim()
    if (comment) {
      if (!this.comments[articleId]) {
        this.comments[articleId] = []
      }
      this.comments[articleId].push(comment)
      this.newComment[articleId] = ""
    }
  }

  toggleComments(articleId: number): void {
    this.showComments[articleId] = !this.showComments[articleId]
  }

  shareArticle(article: ArticleDTORes): void {
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.description,
          url: window.location.href,
        })
        .catch((error) => console.log("Erreur de partage", error))
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      alert(`Partagez cet article: ${article.title}\n${window.location.href}`)
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode
    localStorage.setItem("darkMode", this.darkMode.toString())
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page
      this.applyFilters()
      // Scroll to top of articles section
      document.getElementById("articles")?.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Correction de la méthode pour éviter l'erreur de type string | number
  getPageNumbers(): Array<number | string> {
    const pages: Array<number | string> = []

    if (this.totalPages <= 7) {
      // Si moins de 7 pages, afficher toutes les pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Toujours afficher la première page
      pages.push(1)

      // Ajouter des points de suspension si la page actuelle est > 3
      if (this.currentPage > 3) {
        pages.push("...")
      }

      // Ajouter les pages autour de la page actuelle
      const start = Math.max(2, this.currentPage - 1)
      const end = Math.min(this.totalPages - 1, this.currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Ajouter des points de suspension si la page actuelle est < totalPages - 2
      if (this.currentPage < this.totalPages - 2) {
        pages.push("...")
      }

      // Toujours afficher la dernière page
      pages.push(this.totalPages)
    }

    return pages
  }

  // Méthodes utilitaires pour générer des données de démo
  private getRandomCategory(): string {
    const categories = ["Technologie", "Lifestyle", "Voyage", "Cuisine", "Santé", "Business"]
    return categories[Math.floor(Math.random() * categories.length)]
  }

  private getRandomAuthorName(): string {
    const names = ["Sophie Martin", "Thomas Dubois", "Emma Bernard", "Lucas Petit", "Chloé Leroy"]
    return names[Math.floor(Math.random() * names.length)]
  }

  private generateRandomComments(): string[] {
    const comments = [
      "Super article, merci pour le partage !",
      "Très intéressant, j'ai beaucoup appris.",
      "Je ne suis pas tout à fait d'accord avec certains points.",
      "Pourriez-vous développer davantage le troisième point ?",
      "J'adore votre façon d'aborder ce sujet complexe.",
      "Article bien écrit et très informatif.",
    ]

    const count = Math.floor(Math.random() * 4) // 0 à 3 commentaires
    const result: string[] = []

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * comments.length)
      result.push(comments[randomIndex])
    }

    return result
  }
}

