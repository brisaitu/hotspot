(() => {
  const progress = document.querySelector('.progress-bar');
  const toast = document.querySelector('.toast');
  const shareButton = document.querySelector('[data-share]');
  const yearNodes = document.querySelectorAll('[data-current-year]');

  // Servidores como o GitHub Pages abrem automaticamente o index.html de cada
  // pasta. Em testes locais (file://), o Windows mostra a pasta em vez da
  // página. Acrescentamos index.html apenas nesse cenário.
  if (window.location.protocol === 'file:') {
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('//') ||
        /^[a-z][a-z0-9+.-]*:/i.test(href)
      ) {
        return;
      }

      const match = href.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
      if (match?.[1].endsWith('/')) {
        link.setAttribute(
          'href',
          `${match[1]}index.html${match[2] || ''}${match[3] || ''}`,
        );
      }
    });
  }

  yearNodes.forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  if (progress) {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
  }

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.setTimeout(() => toast.classList.remove('is-visible'), 2400);
  };

  if (shareButton) {
    shareButton.addEventListener('click', async () => {
      const shareData = {
        title: document.title,
        text: document.querySelector('meta[name="description"]')?.content || '',
        url: window.location.href,
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
          return;
        }
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copiado.');
      } catch (error) {
        if (error?.name !== 'AbortError') {
          showToast('Não foi possível compartilhar este link.');
        }
      }
    });
  }
})();
