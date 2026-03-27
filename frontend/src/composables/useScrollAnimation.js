import { onMounted, onUnmounted } from 'vue'

export function useScrollAnimation(selector = '[data-animate]') {
  let observer = null

  onMounted(() => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

    document.querySelectorAll(selector).forEach(el => observer.observe(el))
  })

  onUnmounted(() => { if (observer) observer.disconnect() })
}
