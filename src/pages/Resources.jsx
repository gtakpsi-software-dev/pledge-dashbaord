import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CAREER_RESOURCE_LINKS, EXTRA_RESOURCE_LINKS } from '../data/resourcesLinks';
import './Resources.css';

function Resources() {
  const { user, logout } = useAuth();

  const internalCards = [
    {
      to: '/feedback-center',
      icon: '💬',
      title: 'Feedback Center',
      description: 'Milestone and weekly feedback from brothers and admins.',
    },
    {
      to: '/one-on-one-tracker',
      icon: '📋',
      title: '1:1 Tracker',
      description: 'Networking, brotherhood, alumni, and industry one-on-ones.',
    },
    {
      to: '/dashboard',
      icon: '📅',
      title: 'Full dashboard',
      description: 'Calendar, todos, and detailed progress stats.',
    },
    {
      to: '/home',
      icon: '🏠',
      title: 'Home overview',
      description: 'Progress snapshot, upcoming events, and commitments.',
    },
  ];

  return (
    <div className="resources-page">
      <nav className="resources-nav">
        <Link to="/home" className="resources-nav-brand">
          <div className="greek-letters-small">ΑΚΨ</div>
          <h1>Pledge Dashboard</h1>
        </Link>
        <div className="resources-nav-links">
          <Link to="/home" className="nav-link">
            Home
          </Link>
          <Link to="/resources" className="nav-link nav-link-active">
            Resources
          </Link>
          <Link to="/dashboard" className="nav-link">
            Full Dashboard
          </Link>
          {user?.role === 'admin' && (
            <>
              <Link to="/admin/todos" className="btn-admin-link">
                Manage Todos
              </Link>
              <Link to="/admin/feedback" className="btn-admin-link">
                Manage Feedback
              </Link>
            </>
          )}
          <span className="user-name">{user?.fullName}</span>
          <span className="user-class">{user?.pledgeClass || user?.role}</span>
          <button type="button" onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <main className="resources-main">
        <header className="resources-hero">
          <h2>Resources</h2>
          <p>
            Quick links to feedback, dashboard tools, and career resources your chapter can
            customize.
          </p>
        </header>

        <section className="resources-section">
          <h3>Dashboard & feedback</h3>
          <p className="resources-section-intro">
            Everything tied to your pledging progress in this app.
          </p>
          <div className="resources-grid">
            {internalCards.map((card) => (
              <Link key={card.to} to={card.to} className="resource-card resource-card-internal">
                <div className="resource-card-icon">{card.icon}</div>
                <h4>{card.title}</h4>
                <p>{card.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="resources-section">
          <h3>Career & professional</h3>
          <p className="resources-section-intro">
            External sites — replace URLs in the data file with your chapter’s picks.
          </p>
          <ul className="resource-external-list">
            {CAREER_RESOURCE_LINKS.filter((l) => l.enabled).map((link) => {
              const isPlaceholder = !link.url || link.url === '#';
              return (
                <li key={link.id}>
                  <a
                    href={isPlaceholder ? '#' : link.url}
                    target={isPlaceholder ? '_self' : '_blank'}
                    rel={isPlaceholder ? undefined : 'noopener noreferrer'}
                    className={`resource-external-link ${isPlaceholder ? 'resource-external-placeholder' : ''}`}
                    onClick={isPlaceholder ? (e) => e.preventDefault() : undefined}
                  >
                    <span className="resource-external-title">{link.title}</span>
                    {!isPlaceholder && (
                      <span className="resource-external-arrow" aria-hidden>
                        ↗
                      </span>
                    )}
                  </a>
                  {link.description && (
                    <p className="resource-external-desc">{link.description}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="resources-section">
          <h3>Chapter & other</h3>
          <p className="resources-section-intro">
            Shared docs, dress code, and anything else your pledge class needs.
          </p>
          <ul className="resource-external-list">
            {EXTRA_RESOURCE_LINKS.filter((l) => l.enabled).map((link) => {
              const isPlaceholder = !link.url || link.url === '#';
              return (
                <li key={link.id}>
                  <a
                    href={isPlaceholder ? '#' : link.url}
                    target={isPlaceholder ? '_self' : '_blank'}
                    rel={isPlaceholder ? undefined : 'noopener noreferrer'}
                    className={`resource-external-link ${isPlaceholder ? 'resource-external-placeholder' : ''}`}
                    onClick={isPlaceholder ? (e) => e.preventDefault() : undefined}
                  >
                    <span className="resource-external-title">{link.title}</span>
                    {!isPlaceholder && (
                      <span className="resource-external-arrow" aria-hidden>
                        ↗
                      </span>
                    )}
                  </a>
                  {link.description && (
                    <p className="resource-external-desc">{link.description}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default Resources;
