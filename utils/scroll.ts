import React from 'react';

export const scrollToSection = (e: React.MouseEvent<HTMLElement>, href: string) => {
  e.preventDefault();
  const targetId = href.replace('#', '');
  
  // Handle empty or top links
  if (!targetId || href === '#') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    return;
  }

  const element = document.getElementById(targetId);
  if (element) {
    // Offset calculation for fixed header (85px)
    const headerOffset = 85; 
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};