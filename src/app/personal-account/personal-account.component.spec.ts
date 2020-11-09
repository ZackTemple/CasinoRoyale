import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Player } from '../games/blackjack/objects/player';

import { PersonalAccountComponent } from './personal-account.component';

describe('PersonalAccountComponent', () => {
  let component: PersonalAccountComponent;
  let mockAuthService;
  let router: Router;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(['getPlayer']);

    component = new PersonalAccountComponent(mockAuthService, router);

    component.player = new Player({
      username: 'foo',
      password: 'bar',
      active: false,
      currentMoney: 900,
      totalEarned: 1000,
      totalLost: 100,
      id: 'id-here'
    });
    mockAuthService.getPlayer.and.returnValue(of(component.player));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
