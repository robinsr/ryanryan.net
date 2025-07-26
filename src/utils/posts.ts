// Dynamically fetch all blog posts
const allPosts = import.meta.glob('../pages/posts/*.md', { eager: true });

// Transform the posts to match the expected format
const posts = Object.entries(allPosts)
    .map(([, post]: [string, any]) => {
        const url = post.url || '';

        // Handle invalid dates gracefully
        let pubDate;
        try {
            pubDate = new Date(post.frontmatter.pubDate);
            if (isNaN(pubDate.getTime())) {
                // If date is invalid, use current date
                pubDate = new Date();
            }
        } catch (error) {
            pubDate = new Date();
        }

        return {
            title: post.frontmatter.title,
            description: post.frontmatter.description || '',
            pubDate: pubDate,
            url: url,
            category: post.frontmatter.category || '',
            tags: post.frontmatter.tags || [],
            image: post.frontmatter.image || undefined
        };
    })
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

export { posts };