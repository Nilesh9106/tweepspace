const hashtagRegex = /\^\^\^@@@([^]+?)@@@\^\^\^/g;
const mentionRegex = /\^\^\^###([^]+?)###\^\^\^/g;

export const parceText = (text: string) => {
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

  return text;
};
