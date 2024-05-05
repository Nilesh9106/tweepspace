import { UsersHelper } from '@/helpers/users';
import User from '@/models/user';
import { UserTypeWithIds } from '@/types/model';
import { dbConnect } from '@/utils/mongodb';
import { MetadataRoute } from 'next';

const URL = 'https://tweepspace.vercel.app';

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  await dbConnect();
  const users = await User.find();
  const routes = users.map(user => ({
    url: `${URL}/user/${user.username}`,
    lastModified: user.created_at.toISOString()
  }));
  const defaultRoute = {
    url: `${URL}`,
    lastModified: new Date().toISOString()
  };
  return [defaultRoute, ...routes];
}
