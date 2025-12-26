import { useState, useEffect } from 'react'
import { Link } from 'react-router'

interface Article {
    id: string;
    slug: string;
    title: string;
    date: string;
    excerpt: string;
}

function Articles() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                // Import all markdown files from articles folder
                const markdownFiles = import.meta.glob('/src/articles/*.md', { query: '?raw', import: 'default' })
                const articles: Article[] = []

                for (const [path, importFn] of Object.entries(markdownFiles)) {
                    const content = await importFn() as string
                    const metadata = extractMetadata(content)
                    const slug = path.split('/').pop()?.replace('.md', '') || ''

                    articles.push({
                        id: slug,
                        slug,
                        ...metadata
                    })
                }

                setArticles(articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
            } catch (error) {
                console.error('Error loading articles:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchArticles()
    }, [])

    const extractMetadata = (content: string) => {
        const match = content.match(/^---\s*([\s\S]*?)\s*---/m)
        const metadata = { title: '', date: '', excerpt: '' }

        if (match) {
            const metaContent = match[1]
            metadata.title = metaContent.match(/title:\s*(.+?)(?:\r?\n|$)/)?.[1]?.trim() || ''
            metadata.date = metaContent.match(/date:\s*(.+?)(?:\r?\n|$)/)?.[1]?.trim() || ''
            metadata.excerpt = metaContent.match(/excerpt:\s*(.+?)(?:\r?\n|$)/)?.[1]?.trim() || ''
        }

        return metadata
    }

    if (loading) return <section className="articles"><p>Loading articles...</p></section>

    return (
        <section className="articles">
            <h2>Articles</h2>
            <div className="articles-grid">
                {articles.map(article => (
                    <div className="article-card" key={article.id}>
                    <Link key={article.id} to={`/article/${article.slug}`}>
                        <h3>{article.title}</h3>
                     </Link>
                        <p className="article-date">{new Date(article.date).toLocaleDateString()}</p>
                        <p className="article-excerpt">{article.excerpt}</p>
                    </div>
                   
                ))}
            </div>
        </section>
    )
}

export default Articles