import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router'

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  // Make sure this is NOT empty
  topLevelItems: TopLevelItem[] = [
    {
      title: 'داشبورد',
      icon: '../../../assets/images/svg/home.svg',
      children: [{ title: 'خانه', href: '/', active: true }],
    },
    {
      title: 'گزارش گیری',
      icon: '../../../assets/images/svg/report.svg',
      children: [
        { title: 'خروج کالا به تفکیک واحد', href: '/report' },
      ],
    },
    {
      title: 'مدیرت فرآیند ها',
      icon: '../../../assets/images/svg/process.svg',
      children: [
        { title: 'فرآیند های خروج کالا', href: '/processes' },
      ],
    },
    {
      title: 'مدیریت کاربران',
      icon: '../../../assets/images/svg/users.svg',
      children: [
        { title: 'لایه روشن', href: 'index-kit.html' },
        { title: 'لایه تاریک', href: 'layout-dark.html' },
      ],
    },
    {
      title: 'تنظیمات',
      icon: '../../../assets/images/svg/setting.svg',
      children: [
        { title: 'فوتر روشن', href: 'footer-light.html' },
        { title: 'فوتر تاریک', href: 'footer-dark.html' },
        { title: 'فوتر ثابت', href: 'footer-fixed.html' },
      ],
    },
  ];

  /** which top-level item is open; null means none */
  activeIndex: number | null = 0; // open first by default (set null to start closed)

  onItemClick(index: number, event: Event) {
    event.preventDefault();
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  isOpen(index: number): boolean {
    return this.activeIndex === index;
  }
}

interface SubItem {
  title: string;
  href: string;
  active?: boolean;
}

interface TopLevelItem {
  title: string;
  icon?: string; // optional: svg/icon markup string or class
  children?: SubItem[];
}
