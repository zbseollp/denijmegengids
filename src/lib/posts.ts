/**
 * Single source of truth for "which posts are live".
 *
 * The blog archive, the homepage block, the article routes and the sitemap all
 * read from here, so they can never disagree: a post linked but not built is a
 * 404, and a post built but never linked is invisible to readers and crawlers.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { resolveFeaturedImage, resolveFeaturedImageAlt } from './blogImages';

export type Post = CollectionEntry<'blog'>;

/**
 * CMS clocks and "publish now" often land a few hours ahead of the build host.
 * Only hide posts scheduled clearly in the future — not same-day skew.
 * Keep in sync with scripts/assert-publish-ready.mjs (FUTURE_SLACK_MS).
 */
export const FUTURE_SLACK_MS = 48 * 60 * 60 * 1000;

/** Payload writes a boolean; WordPress exports write the string "true". */
function isDraft(data: Post['data']): boolean {
  const draft = (data as { draft?: unknown }).draft;
  return draft === true || draft === 'true';
}

/** Payload writes _status: published | draft. Absent means published. */
function isPublished(data: Post['data']): boolean {
  const raw = data as { publishStatus?: unknown; _status?: unknown };
  const status = String(raw.publishStatus ?? raw._status ?? '').trim().toLowerCase();
  if (!status) return true;
  return status === 'published' || status === 'publish';
}

export function postPublishTime(post: Post): number {
  const d = post.data as { pubDate?: Date; date?: Date; updatedDate?: Date };
  const published = d.pubDate ?? d.date;
  if (published instanceof Date && !Number.isNaN(published.valueOf())) return published.valueOf();
  if (d.updatedDate instanceof Date && !Number.isNaN(d.updatedDate.valueOf())) {
    return d.updatedDate.valueOf();
  }
  // Missing/unparseable dates must still come online (schema falls back to epoch).
  return 0;
}

export function isLiveByDate(post: Post, now = Date.now()): boolean {
  return postPublishTime(post) <= now + FUTURE_SLACK_MS;
}

export function sortPostsNewestFirst(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    const diff = postPublishTime(b) - postPublishTime(a);
    return diff !== 0 ? diff : b.id.localeCompare(a.id);
  });
}

let cached: Post[] | null = null;

async function loadAll(): Promise<Post[]> {
  if (cached) return cached;
  const now = Date.now();
  const all = await getCollection('blog', ({ data }) => isPublished(data) && !isDraft(data));
  cached = sortPostsNewestFirst(all.filter((post) => isLiveByDate(post, now)));
  return cached;
}

export async function getAllPosts(): Promise<Post[]> {
  return loadAll();
}

export async function getRecentPosts(n = 6): Promise<Post[]> {
  return (await loadAll()).slice(0, n);
}

export async function getRelatedPosts(current: Post, n = 3): Promise<Post[]> {
  const all = await loadAll();
  const others = all.filter((p) => p.id !== current.id);
  const currentCats = current.data.categories ?? [];
  const sameCategory = others.filter((p) =>
    (p.data.categories ?? []).some((c) => currentCats.includes(c)),
  );
  const filler = others.filter((p) => !sameCategory.includes(p));
  return [...sameCategory, ...filler].slice(0, n);
}

export function postUrl(post: Post): string {
  return `/${post.id}/`;
}

export function postDisplayDate(post: Post): Date {
  const d = post.data as { pubDate?: Date; date?: Date };
  return d.pubDate ?? d.date ?? new Date(0);
}

/** Card / hero image; null means "render no <img>", never a broken one. */
export function postImage(post: Post): string | null {
  return resolveFeaturedImage(post.data, post.body);
}

export function postImageAlt(post: Post): string {
  return resolveFeaturedImageAlt(post.data, post.data.title);
}
