export const parseIssueContent = text => {
  return text
    .replace(/(?:\r\n|\r|\n)/g, '<br />')
    .replace(
      /(.*\[)(.*)(\]\()(https?:.+)(\))/g,
      '<a style="color:rgb(33, 111, 219);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" href=$4 target="_blank">$2</a>',
    );
};

export const parseCommentContent = text => {
  return text
    .replace(/(?:\r\n|\r|\n)/g, '<br />')
    .replace(
      /(https?:\/\/)([^ ]+)/g,
      `<a style="color:rgb(33, 111, 219);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" href=$& target="_blank">$2</a>`,
    );
};
