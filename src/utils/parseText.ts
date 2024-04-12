const hashtagRegex = /\^\^\^@@@([^]+?)@@@\^\^\^/g;
const mentionRegex = /\^\^\^###([^]+?)###\^\^\^/g;

export const parseText = (text: string) => {
  text = text.replace(
    hashtagRegex,
    (match, tag) =>
      `<a class="text-blue-500 hover:underline clickable-tag cursor-pointer" href="https://tweepspace.vercel.app/hashtag/${tag}">#${tag}</a>`
  );

  // Replace mentions with clickable links
  text = text.replace(
    mentionRegex,
    (match, username) =>
      `<a class="text-green-500 hover:underline clickable-tag" href="https://tweepspace.vercel.app/user/${username}">@${username}</a>`
  );
  text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');

  return text;
};

export const parseTextWithoutHtml = (text: string) => {
  text = text.replace(hashtagRegex, (match, tag) => `#${tag}`);

  // Replace mentions with clickable links
  text = text.replace(mentionRegex, (match, username) => `@${username}`);
  text = text.replace(/(?:\r\n|\r|\n)/g, ' ');
  return text;
};

export const toBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };

    fileReader.onerror = error => {
      reject(error);
    };
  });
};
