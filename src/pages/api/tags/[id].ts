import type { APIRoute } from 'astro';
import { tagService, questionService } from '../../../services';

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Tag ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const tag = await tagService.getTagById(id);

    if (!tag) {
      return new Response(JSON.stringify({ error: 'Tag not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 获取标签的关注者数量
    const followerCount = await tagService.getTagFollowerCount(id);

    // 获取与标签相关的问题
    const questions = await questionService.getQuestionsByTag(id, page, limit);

    // 获取相关标签
    const relatedTags = await tagService.getRelatedTags(id, 5);

    return new Response(JSON.stringify({
      tag: {
        ...tag,
        followerCount
      },
      questions,
      relatedTags
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching tag:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
