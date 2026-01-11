import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  frontmatter: {
    title: string
    description: string
    date: string
    author: string
    img: string
    tags: string[]
    published?: boolean
  }
  content: string
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const files = fs.readdirSync(contentDirectory)

  const posts = files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const slug = file.replace('.mdx', '')
      const fullPath = path.join(contentDirectory, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        frontmatter: data as BlogPost['frontmatter'],
        content
      }
    })
    .filter(post => post.frontmatter.published !== false)
    .sort((a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
    )

  return posts
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      frontmatter: data as BlogPost['frontmatter'],
      content
    }
  } catch (error) {
    return null
  }
}
