// Data
function now(): string {
  const d = new Date();

  const day = String(d.getDate());
  const month = String(d.getMonth());
  const year = d.getFullYear();

  const hours = String(d.getHours());
  const minutes = String(d.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export {now};