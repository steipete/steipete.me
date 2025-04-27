import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
	let posts = await getCollection('blog');
	// Add filename as slug if it's not available
	posts = posts.map(post => {
		if (!post.slug) {
			const filePath = post.id;
			const fileName = filePath.split('/').pop() || '';
			const fileNameWithoutExt = fileName.replace(/\.(md|mdx)$/, '');
			post.slug = fileNameWithoutExt;
		}
		return post;
	});

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title || post.slug,
			description: post.data.description || '',
			pubDate: post.data.pubDate || new Date(),
			link: `/blog/${post.slug}/`,
		})),
	});
}