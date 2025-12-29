import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router'
import ReactMarkdown, { type Components } from 'react-markdown'
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
                    const rawContent = await importFn() as string
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