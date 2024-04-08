export const mentionStyleDark = {
  control: {
    backgroundColor: '#131313',
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
      border: '2px solid #323232',
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
