import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MockModule } from 'ng-mocks';
import { of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Player } from '../blackjack/objects/player';
import { SlotMachineComponent } from './slot-machine.component';
import { ImagesArray, SlotMachineImage } from './slots-images';

describe('SlotMachineComponent', () => {
  let component: SlotMachineComponent;
  let fixture: ComponentFixture<SlotMachineComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let playerObject: Player;
  const cherryImage = new SlotMachineImage('Cherries', 'cherries.jpg', 1);
  const bellImage = new SlotMachineImage('Bell', 'bell.jpg', 2);
  const watermelonImage = new SlotMachineImage('Watermelon', 'watermelon.jpg', 3);

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(['updatePlayer', 'getPlayer']);
    playerObject = new Player({
      username: 'MichaelScott',
      password: 'password',
      active: false,
      currentMoney: 20,
      totalEarned: 20,
      totalLost: 10000
    });

    await TestBed.configureTestingModule({
      imports: [ MockModule(MatMenuModule), MockModule(FormsModule) ],
      declarations: [ SlotMachineComponent ],
      providers: [ {provide: AuthService , useValue: mockAuthService}],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    mockAuthService.getPlayer.and.returnValue(of( playerObject ));
    mockAuthService.updatePlayer.and.returnValue(of( playerObject ));
    fixture = TestBed.createComponent(SlotMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('On Init', () => {
    it('should give all grid items an index and initialize the machine cloumn image arrays', () => {
      component.leftWheelMiddleIndex = null;
      component.centerWheelMiddleIndex = null;
      component.rightWheelMiddleIndex = null;
      component.leftSlotImages = null;
      component.centerSlotImages = null;
      component.rightSlotImages = null;

      component.ngOnInit();

      expect(component.leftWheelMiddleIndex).toBeGreaterThanOrEqual(0);
      expect(component.leftWheelMiddleIndex).toBeLessThanOrEqual(ImagesArray.length - 1);
      expect(component.centerWheelMiddleIndex).toBeGreaterThanOrEqual(0);
      expect(component.centerWheelMiddleIndex).toBeLessThanOrEqual(ImagesArray.length - 1);
      expect(component.rightWheelMiddleIndex).toBeGreaterThanOrEqual(0);
      expect(component.rightWheelMiddleIndex).toBeLessThanOrEqual(ImagesArray.length - 1);

      expect(component.leftSlotImages.length).toBe(ImagesArray.length);
      expect(component.centerSlotImages.length).toBe(ImagesArray.length);
      expect(component.rightSlotImages.length).toBe(ImagesArray.length);
    });
  });

  describe('validateBet', () => {
    it('should reset winner attribute to false for the new round', () => {
      component.player.bet = 25;
      component.player.currentMoney = 50;
      component.winner = true;

      component.validateBet();

      clearInterval(component.leftSlot);
      clearInterval(component.centerSlot);
      clearInterval(component.rightSlot);

      expect(component.winner).toBeFalsy();
    });

    it('should start the spinning if the bet is valid', () => {

    });

    it('should do nothing if the bet is invalid', () => {
      component.player.bet = 50;
      component.player.currentMoney = 25;

      component.validateBet();

      clearInterval(component.leftSlot);
      clearInterval(component.centerSlot);
      clearInterval(component.rightSlot);
    });
  });

  describe('startSpin()', () => {
    beforeEach(() => {
      component.leftWheelMiddleIndex = 1;
      component.centerWheelMiddleIndex = 1;
      component.rightWheelMiddleIndex = 1;
    });

    // could use spyOn() here, but no need. Just test the side effects.
    it('should call increaseWheelIndexByOne() every 400 miliseconds for EASY mode', fakeAsync(() => {
      component.currentGameMode = component.gameModes.EASY;

      component.startSpin();
      expect(component.leftWheelMiddleIndex).toBe(1);
      tick(200);
      expect(component.leftWheelMiddleIndex).toBe(1);
      tick(200);
      expect(component.leftWheelMiddleIndex).toBe(2);

      // call the stopSpin function three times to stop the setInterval calls
      component.stopSpin();
      component.stopSpin();
      component.stopSpin();
    }));

    // could use spyOn() here, but no need. Just test the side effects.
    it('should call increaseWheelIndexByOne() every 50 miliseconds for NORMAL mode', fakeAsync(() => {
      component.currentGameMode = component.gameModes.NORMAL;

      component.startSpin();
      expect(component.leftWheelMiddleIndex).toBe(1);
      tick(25);
      expect(component.leftWheelMiddleIndex).toBe(1);
      tick(25);
      expect(component.leftWheelMiddleIndex).toBe(2);

      // call the stopSpin function three times to stop the setInterval calls
      component.stopSpin();
      component.stopSpin();
      component.stopSpin();
    }));

    // could use spyOn() here, but no need. Just test the side effects.
    it('should call increaseWheelIndexByOne() every 5 miliseconds for GODMODE mode', fakeAsync(() => {
      component.currentGameMode = component.gameModes.GODMODE;

      component.startSpin();
      expect(component.leftWheelMiddleIndex).toBe(1);
      tick(3);
      expect(component.leftWheelMiddleIndex).toBe(1);
      tick(2);
      expect(component.leftWheelMiddleIndex).toBe(2);

      // call the stopSpin function three times to stop the setInterval calls
      component.stopSpin();
      component.stopSpin();
      component.stopSpin();
    }));
  });

  describe('checkForWinner', () => {
    beforeEach(() => {
      component.leftWheelMiddleIndex = 1;
      component.centerWheelMiddleIndex = 1;
      component.rightWheelMiddleIndex = 1;

      component.winner = false;
    });

    it('should not award the player if the player did not win match 3 on any row', () => {
      component.leftSlotImages = [cherryImage, cherryImage, cherryImage];
      component.centerSlotImages = [bellImage, bellImage, bellImage];
      component.rightSlotImages = [watermelonImage, watermelonImage, watermelonImage];
      const moneyBeforeWinCheck = component.player.currentMoney;

      component.checkForWinner();

      expect(component.winner).toBeFalsy();
      expect(component.player.currentMoney).toBe(moneyBeforeWinCheck);
    });

    it('should award the player 5 times original bet if the player matched 3 images on a single row', () => {
      component.leftSlotImages = [cherryImage, cherryImage, cherryImage];
      component.centerSlotImages = [bellImage, bellImage, cherryImage];
      component.rightSlotImages = [watermelonImage, watermelonImage, cherryImage];
      const moneyBeforeWinCheck = component.player.currentMoney;
      component.player.bet = 10;

      component.checkForWinner();

      expect(component.winner).toBeTruthy();
      expect(component.player.currentMoney).toBe(moneyBeforeWinCheck + component.player.bet * 5);
    });

    it('should award the player 20 times original bet if the player matched 3 images on only two rows', () => {
      component.leftSlotImages = [cherryImage, cherryImage, cherryImage];
      component.centerSlotImages = [bellImage, cherryImage, cherryImage];
      component.rightSlotImages = [watermelonImage, cherryImage, cherryImage];
      const moneyBeforeWinCheck = component.player.currentMoney;
      component.player.bet = 10;

      component.checkForWinner();

      expect(component.winner).toBeTruthy();
      expect(component.player.currentMoney).toBe(moneyBeforeWinCheck + component.player.bet * 20);
    });

    it('should award the player 100 times original bet if the player matched 3 images on only two rows', () => {
      component.leftSlotImages = [cherryImage, bellImage, watermelonImage];
      component.centerSlotImages = [cherryImage, bellImage, watermelonImage];
      component.rightSlotImages = [cherryImage, bellImage, watermelonImage];
      const moneyBeforeWinCheck = component.player.currentMoney;
      component.player.bet = 10;

      component.checkForWinner();

      expect(component.winner).toBeTruthy();
      expect(component.player.currentMoney).toBe(moneyBeforeWinCheck + component.player.bet * 100);
    });
  });

  describe('setGameMode', () => {
    it('should set the game mode from its input', () => {
      component.currentGameMode = component.gameModes.NORMAL;

      component.setGameMode(component.gameModes.EASY);

      expect(component.currentGameMode).toBe(component.gameModes.EASY);
    });
  });

  describe('The front end', () => {
    beforeEach(() => {
      component.leftSlotImages = [cherryImage, bellImage, watermelonImage];
      component.centerSlotImages = [watermelonImage, bellImage, cherryImage];
      component.rightSlotImages = [cherryImage, bellImage, watermelonImage];
      component.leftWheelMiddleIndex = 1;
      component.centerWheelMiddleIndex = 1;
      component.rightWheelMiddleIndex = 1;

      fixture.detectChanges();
    });

    it('should display the image at the respective index in each of the respective image arrays', () => {
      const topLeftImage = fixture.nativeElement.querySelector('.top-left') as HTMLScriptElement;
      const middleCenterImage = fixture.nativeElement.querySelector('.middle-center') as HTMLScriptElement;
      const bottomRightImage = fixture.nativeElement.querySelector('.bottom-right') as HTMLScriptElement;

      // taken from the images arrays set above in the beforeEach()
      expect(topLeftImage.getAttribute('src')).toBe(watermelonImage.imageUrl);
      expect(middleCenterImage.getAttribute('src')).toBe(bellImage.imageUrl);
      expect(bottomRightImage.getAttribute('src')).toBe(cherryImage.imageUrl);
    });

    it('should wrap around the images array if the index is at an extremity of the array', () => {
      component.leftSlotImages = [cherryImage, bellImage, watermelonImage];
      component.centerSlotImages = [watermelonImage, bellImage, cherryImage];

      // setting the middle values as extremities
      // the top left image will be displayed from the first item in the leftSlotImagesArray
      // and the bottom center image will be displayed using the last image in the centerSlotImagesArray
      component.leftWheelMiddleIndex = component.leftSlotImages.length - 1;
      component.centerWheelMiddleIndex = 0;

      fixture.detectChanges();

      const topLeftImage = fixture.nativeElement.querySelector('.top-left') as HTMLScriptElement;
      const bottomCenterImage = fixture.nativeElement.querySelector('.bottom-center') as HTMLScriptElement;

      expect(topLeftImage.getAttribute('src')).toBe(cherryImage.imageUrl);
      expect(bottomCenterImage.getAttribute('src')).toBe(cherryImage.imageUrl);
    });
  });

});
