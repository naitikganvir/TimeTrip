export function logger(socket) {
  const { href, pathname, search } = window.location;

  const paramsArray = Array.from(
    new URLSearchParams(search),
    ([key, value]) => ({ key, value })
  );

  const log = {
    url: href,
    path: pathname,
    timestamp: new Date().toISOString(),
  };
  
  if (paramsArray.length > 0)  {
    log.params = paramsArray;
  }

  socket.emit("log", log);
}
