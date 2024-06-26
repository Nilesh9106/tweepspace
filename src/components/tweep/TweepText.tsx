import { webRoutes } from '@/constants/routes';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface TweepTextProps {
  text: string;
}

const TweepText: React.FC<TweepTextProps> = ({ text }) => {
  const hashtagRegex = /\^\^\^@@@([^]+?)@@@\^\^\^/g;
  const mentionRegex = /\^\^\^###([^]+?)###\^\^\^/g;
  const router = useRouter();
  const parseText = (text: string) => {
    // Replace hashtags with clickable links
    text = text.replace(
      hashtagRegex,
      (match, tag) =>
        `<a class="text-blue-500 hover:underline clickable-tag cursor-pointer" href="${webRoutes.tweepWithHashtag(
          tag
        )}">#${tag}</a>`
    );

    // Replace mentions with clickable links
    text = text.replace(
      mentionRegex,
      (match, username) =>
        `<a class="text-green-500 hover:underline clickable-tag" href="${webRoutes.user(
          username
        )}">@${username}</a>`
    );
    text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');

    return text;
  };
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('clickable-tag')) {
        e.preventDefault();
        router.push(target.getAttribute('href')!);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const parsedText = parseText(text);
  return <p dangerouslySetInnerHTML={{ __html: parsedText }} />;
};

export default TweepText;
