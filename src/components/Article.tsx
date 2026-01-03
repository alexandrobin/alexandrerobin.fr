import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { Helmet } from 'react-helmet-async'
import ReactMarkdown, { type Components } from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface ArticleMetadata {
    title: string
    date?: string
    excerpt?: string
}

function Article() {
    const { slug } = useParams<{ slug: string }>()
    const [content, setContent] = useState<string>('')
    const [metadata, setMetadata] = useState<ArticleMetadata>({ title: 'Article' })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadArticle = async () => {
            try {
                const markdownFiles = import.meta.glob('/src/articles/*.md', { query: '?raw', import: 'default' })
                const path = `/src/articles/${slug}.md`
                const importFn = markdownFiles[path]
                if (importFn) {
                    const rawContent = await importFn() as string
                    
                    // Extract frontmatter metadata
                    const trimmedContent = rawContent.trimStart()
                    const frontmatterMatch = trimmedContent.match(/^---\n([\s\S]*?)\n---/)
                    
                    if (frontmatterMatch) {
                        const frontmatter = frontmatterMatch[1]
                        const titleMatch = frontmatter.match(/title:\s*(.+)/)
                        const excerptMatch = frontmatter.match(/excerpt:\s*(.+)/)
                        const dateMatch = frontmatter.match(/date:\s*(.+)/)
                        
                        setMetadata({
                            title: titleMatch ? titleMatch[1].trim() : slug || 'Article',
                            excerpt: excerptMatch ? excerptMatch[1].trim() : undefined,
                            date: dateMatch ? dateMatch[1].trim() : undefined,
                        })
                    }
                    
                    // Remove frontmatter (YAML metadata between ---), including any markdown code blocks
                    const contentWithoutFrontmatter = trimmedContent
                        .replace(/^```\n---[\s\S]*?---\n```\n/, '')
                        .replace(/^---[\s\S]*?---\n/, '')
                        .replace(/```\s*$/, '')
                    setContent(contentWithoutFrontmatter)
                } else {
                    setContent('Article not found')
                }
            } catch (error) {
                console.error('Error loading article:', error)
                setContent('Error loading article')
            } finally {
                setLoading(false)
            }
        }

        if (slug) {
            loadArticle()
        }
    }, [slug])

    const components: Partial<Components> = {
        // Handle block code via <pre> so inline spans never get misclassified
        pre: (preProps: any) => {
            const child = Array.isArray(preProps.children) ? preProps.children[0] : preProps.children
            const codeProps = (child && typeof child === 'object') ? (child as any).props : undefined
            const className = codeProps?.className || ''
            const codeString = String(codeProps?.children ?? '').replace(/\n$/, '')
            const match = /language-(\w+)/.exec(className)

            if (match) {
                return (
                    <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div">
                        {codeString}
                    </SyntaxHighlighter>
                )
            }
            return (
                <pre className="md-codeblock">
                    <code className={className}>{codeString}</code>
                </pre>
            )
        },
        // Inline code spans only
        code: (props: any) => {
            const { className, children, ...rest } = props
            return (
                <code className={`md-inline-code ${className ?? ''}`} {...rest}>
                    {children}
                </code>
            )
        },
        blockquote: (props) => (
            <blockquote className="custom-blockquote" {...props} />
        ),
    }

    if (loading) return <div>Loading...</div>

    const articleUrl = `https://alexandrerobin.fr/article/${slug}`
    const articleImage = 'https://alexandrerobin.fr/assets/preview.png' // You can customize per article

    return (
        <>
            <Helmet>
                <title>{metadata.title} - Alexandre Robin</title>
                <meta name="description" content={metadata.excerpt || metadata.title} />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={articleUrl} />
                <meta property="og:title" content={metadata.title} />
                <meta property="og:description" content={metadata.excerpt || metadata.title} />
                <meta property="og:image" content={articleImage} />
                {metadata.date && <meta property="article:published_time" content={metadata.date} />}
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={articleUrl} />
                <meta property="twitter:title" content={metadata.title} />
                <meta property="twitter:description" content={metadata.excerpt || metadata.title} />
                <meta property="twitter:image" content={articleImage} />
            </Helmet>
            
            <Link key={"back"} to={"/"}>
                <p>{"Back"}</p>
            </Link>
        <div className="article">
            <ReactMarkdown components={components}>{content}</ReactMarkdown>
        </div>
        </>
    )
}

export default Article