import { fetchAllMedia } from '@/models/mediaModel';

const MediaList = async () => {
  const mediaList = await fetchAllMedia();

  if (!mediaList) {
    return <p>No media found</p>;
  }

  return (
    <section className="flex flex-col p-8">
      <ul className="grid grid-cols-3 gap-4">
        {mediaList.map((item, index) => (
          <li
            key={index}
            className="flex flex-col items-center border border-gray-300 p-4 shadow-lg rounded-md bg-white"
          >
            <h3 className="text-lg font-bold self-start">{item.title}</h3>
            <p>Description: {item.description}</p>
            <p>Date: {new Date(item.created_at).toLocaleDateString('fi-FI')}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MediaList;
