const Loading = props => {
  const loadingStyle = {
    height: (props.height || '40') + 'px',
    width: (props.width || '40') + 'px',
  };

  if (props.width) {
    loadingStyle.width = props.width + 'px';
  }

  return (
    <div className="spinner" style={loadingStyle}>
      <div className="rect1"></div>
      <div className="rect2"></div>
      <div className="rect3"></div>
      <div className="rect4"></div>
      <div className="rect5"></div>
    </div>
  );
};

export default Loading;
