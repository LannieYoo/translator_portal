import { Link, useLocation } from 'react-router-dom'

function Footer() {
  const location = useLocation()
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/hyeran-yoo-7ab496353',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/LannieYoo',
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/laniyoo613',
    },
    {
      name: 'Docker',
      url: 'https://hub.docker.com/u/lannieyoo',
    },
  ]

  return (
    <footer className="w-full px-4 sm:px-6 lg:px-8 py-6 mt-auto relative">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-text-muted-light dark:via-text-muted-dark to-transparent opacity-30"></div>
      <div className="mx-auto max-w-desktop">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center items-center text-center md:text-left text-sm text-text-muted-light dark:text-text-muted-dark gap-3 md:gap-4">
          <p>© 2024 Lannie. All rights reserved.</p>
          <div className="flex flex-col md:flex-row md:items-center items-center gap-3 md:gap-4">
            <div className="flex gap-2 justify-center md:justify-start">
              {socialLinks.map((link, index) => (
                <span key={link.name} className="flex items-center">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                    aria-label={link.name}
                  >
                    {link.name}
                  </a>
                  {index < socialLinks.length - 1 && (
                    <span className="mx-2 text-text-muted-light dark:text-text-muted-dark">|</span>
                  )}
                </span>
              ))}
            </div>
            <Link
              to="/logs"
              className={`text-xs opacity-60 hover:opacity-100 hover:text-primary transition-colors ${
                location.pathname === '/logs' ? 'text-primary opacity-100' : ''
              }`}
            >
              Log Analyzer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
