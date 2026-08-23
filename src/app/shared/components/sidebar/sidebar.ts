import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  readonly navItems: NavItem[] = [
    { label: 'Career Overview', path: '/career', icon: '', exact: true },
    { label: 'Career Roadmaps', path: '/career/roadmaps', icon: '' },
    { label: 'Promotion Criteria', path: '/career/promotion-criteria', icon: '' },
    { label: 'Internal Jobs', path: '/career/jobs', icon: '' },
    { label: 'Saved Jobs', path: '/career/saved-jobs', icon: '' },
    { label: 'Training Analytics', path: '/career/training-analytics', icon: '' },
    { label: 'Executive Dashboard', path: '/career/executive-dashboard', icon: '' }
  ];
}
