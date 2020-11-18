import { of } from 'rxjs';
import { BlackjackComponent } from './blackjack.component';

describe('BlackjackComponent', () => {
  let component: BlackjackComponent;
  let mockAuthService;
  let mockGameService;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(['updatePlayer', 'getPlayer']);
    mockGameService = jasmine.createSpyObj(['startGame', 'dealCardToPlayer', 'finishGame']);
    component = new BlackjackComponent(mockAuthService, mockGameService);

    mockAuthService.getPlayer.and.returnValue(of(component.player));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
