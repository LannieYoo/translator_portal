import './footer.css'

function Footer() {
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/hyeran-yoo-7ab496353',
      icon: '💼',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/LannieYoo',
      icon: '🐙',
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/laniyoo613',
      icon: '📷',
    },
    {
      name: 'Docker',
      url: 'https://hub.docker.com/u/lannieyoo',
      icon: '🐳',
    },
  ]

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-text">
            © 2024 Lannie (HyeRan Yoo). All rights reserved.
          </p>
          <div className="footer-social">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                aria-label={link.name}
              >
                <span className="footer-icon">{link.icon}</span>
                <span className="footer-link-text">{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

