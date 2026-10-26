import {test,expect} from '@playwright/test';

test('Takokit output stays centered and clear of the mark and controls on narrow screens',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const width of [320,390,517,600]){
    await page.setViewportSize({width,height:844});
    for(const route of ['/projects/takokit','/projects']){
      await page.goto(route);await page.evaluate(()=>document.fonts.ready);
      const scene=page.locator('[data-sketch="takokit"]');
      for(const mode of ['Listen','Speak']){
        await scene.getByRole('button',{name:mode,exact:true}).click();
        const output=await scene.locator('.voice-output').boundingBox();
        const orb=await scene.locator('.voice-runtime').boundingBox();
        const name=await scene.locator('.voice-runtime-name').boundingBox();
        const controls=await scene.locator('.voice-modes').boundingBox();
        const wave=await scene.locator('.voice-paths').boundingBox();
        expect(Math.abs(output!.x+output!.width/2-orb!.x-orb!.width/2)).toBeLessThan(1);
        expect(Math.abs(controls!.x+controls!.width/2-orb!.x-orb!.width/2)).toBeLessThan(1);
        expect(Math.abs(wave!.y+wave!.height/2-orb!.y-orb!.height/2)).toBeLessThan(1);
        expect(output!.height).toBeLessThan(30);
        expect(output!.y).toBeGreaterThan(name!.y+name!.height);
        expect(output!.y+output!.height).toBeLessThan(controls!.y);
      }
      if(route.endsWith('takokit')){
        await scene.getByRole('button',{name:'Listen',exact:true}).click();
        await scene.screenshot({path:`output/takokit-alignment-${width}.png`});
      }
    }
  }
});
