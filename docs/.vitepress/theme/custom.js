if (typeof window !== 'undefined') {
  // Ambil tema yang tersimpan
  const savedTheme = localStorage.getItem('vitepress-theme-appearance');

  if (savedTheme) {
    document.documentElement.setAttribute('class', savedTheme);
  } else {
    // Jika tidak ada, gunakan preferensi sistem
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('class', prefersDark ? 'dark' : 'light');
  }

  // Pantau perubahan tema & simpan ke localStorage
  new MutationObserver(() => {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('vitepress-theme-appearance', currentTheme);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}
