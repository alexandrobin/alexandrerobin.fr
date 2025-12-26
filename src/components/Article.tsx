import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

function Article() {
    const { slug } = useParams<{ slug: string }>()
    const [content, setContent] = useState<string>('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadArticle = async () => {
            try {
                const markdownFiles = import.meta.glob('/src/articles/*.md', { query: '?raw', import: 'default' })
                const path = `/src/articles/${slug}.md`
                const importFn = markdownFiles[path]
                if (importFn) {
                    const rawContent = await importFn()
                    // Remove frontmatter (YAML metadata between ---), including any markdown code blocks
                    const trimmedContent = rawContent.trimStart()
                    const contentWithoutFrontmatter = trimmedContent.replace(/^```\n---[\s\S]*?---\n```\n/, '').replace(/^---[\s\S]*?---\n/, '').replace(/```\s*$/, '')
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

    const components = {
        code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children: React.ReactNode; [key: string]: unknown }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
                <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            )
        },
        blockquote({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) {
            return (
                <blockquote className="custom-blockquote" {...props}>
                    {children}
                </blockquote>
            )
        },
    }

    if (loading) return <div>Loading...</div>

    return (
        <>
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