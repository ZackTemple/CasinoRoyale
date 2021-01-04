import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { BlackjackComponent } from './blackjack.component';

describe('BlackjackComponent', () => {
  let component: BlackjackComponent;
  let mockAuthService;
  let mockGameService;
  let dialog;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(['updatePlayer', 'getPlayer']);
    mockGameService = jasmine.createSpyObj(['startGame', 'dealCardToPlayer', 'finishGame']);
    dialog = jasmine.createSpy();
    component = new BlackjackComponent(mockAuthService, mockGameService, dialog);

    mockAuthService.getPlayer.and.returnValue(of(component.player));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
