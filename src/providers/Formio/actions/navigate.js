export const Navigate = {
  to: path => {
    return {
      type: 'NAVIGATE',
      location: {pathname: path},
      action: 'PUSH'
    }
  },
  back: () => {
    return {
      type: 'NAVIGATE',
      action: 'POP' // Is this right?
    }
  }
};
