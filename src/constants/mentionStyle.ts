export const getMentionStyleDark = (theme: string) => {
  return {
    control: {
      backgroundColor: theme === 'dark' ? '#131313' : '#eee',
      fontSize: 13,
      fontWeight: 'normal',
      borderRadius: 4
    },

    '&multiLine': {
      control: {
        minHeight: 63
      },
      highlighter: {
        padding: 9
      },
      input: {
        padding: 9,
        border: '2px solid',
        borderColor: theme === 'dark' ? '#323232' : '#ccc',
        borderRadius: 8,
        outline: 'none'
      }
    },

    suggestions: {
      width: '200px',
      padding: 0,
      borderRadius: 10,
      backgroundColor: 'transparent',
      list: {
        fontSize: 13,
        overflow: 'hidden',
        borderRadius: 10
      },
      item: {}
    }
  };
};
