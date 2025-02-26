import { getSession } from '@/lib/authActions';

const Page = async () => {
  console.log((await getSession())?.user_id);
  return (
    <main>
      <h1 className="text-4xl font-bold">Profile</h1>
    </main>
  );
};

export default Page;
