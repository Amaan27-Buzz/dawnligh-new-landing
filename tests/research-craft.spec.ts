import {test,expect} from '@playwright/test';

test('research connects six fields to a single writing archive',async({page})=>{
  await page.goto('/research');
  await expect(page.locator('.research-fields__list article')).toHaveCount(6);
  await expect(page.locator('.research-writing__list>a')).toHaveCount(3);
  await expect(page.locator('.inquiry')).toHaveCount(0);
  await expect(page.locator('.footer-legal a[href="/research/programs"]')).toHaveCount(0);
  await page.goto('/notes');
  await page.getByRole('button',{name:'Technical articles',exact:true}).click();
  await expect(page.locator('[data-writing-entry]:visible')).toHaveCount(1);
  await page.getByRole('button',{name:'All writing',exact:true}).click();
  await page.getByRole('searchbox',{name:'Find a piece'}).fill('circuit');
  await expect(page.locator('[data-writing-entry]:visible')).toHaveCount(1);
  await page.getByRole('searchbox',{name:'Find a piece'}).fill('nonexistent');
  await expect(page.locator('[data-writing-empty]')).toBeVisible();
  await page.getByRole('searchbox',{name:'Find a piece'}).fill('');
  await expect(page.locator('[data-writing-entry]:visible')).toHaveCount(3);
});

test('voice selection glides while continuous waves follow the selected mode',async({page})=>{
  await page.goto('/projects/takokit');
  const sketch=page.locator('[data-sketch="takokit"]');
  const wave=sketch.locator('.voice-path').first();const original=await wave.getAttribute('d');
  const thumb=()=>sketch.locator('.voice-modes').evaluate(el=>getComputedStyle(el,'::before').transform);
  const before=await thumb();
  await sketch.getByRole('button',{name:'Speak',exact:true}).click();
  await expect.poll(()=>wave.getAttribute('d')).not.toBe(original);
  await expect.poll(thumb).not.toBe(before);
  await sketch.getByRole('button',{name:'Listen',exact:true}).click();
  await sketch.getByRole('button',{name:'Speak',exact:true}).click();
  await expect(sketch.locator('[data-voice-output]')).toHaveText('Speech out');
  const moving=await wave.getAttribute('d');
  await expect.poll(()=>wave.getAttribute('d')).not.toBe(moving);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(wave).toHaveAttribute('d',/^M-10 50 Q15/);
  const still=await wave.getAttribute('d');await page.waitForTimeout(200);
  expect(await wave.getAttribute('d')).toBe(still);
  await expect(sketch.locator('.voice-modes').evaluate(el=>getComputedStyle(el,'::before').transitionDuration)).resolves.toBe('0s');
});

test('project scenes remain readable on desktop and mobile',async({page})=>{
  for(const width of [1440,390,320]){
    await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
    for(const kind of ['oscar','kinetable','aish']){
      await page.goto('/projects/'+kind);await page.evaluate(()=>document.fonts.ready);
      const scene=page.locator('[data-sketch]');
      const bounds=await scene.boundingBox();
      const controls=scene.locator('button:visible');
      for(const control of await controls.all()){
        const box=await control.boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(bounds!.x);
        expect(box!.x+box!.width).toBeLessThanOrEqual(bounds!.x+bounds!.width+1);
        expect(box!.y+box!.height).toBeLessThanOrEqual(bounds!.y+bounds!.height);
      }
      await page.screenshot({path:`output/project-craft-${kind}-${width}.png`,fullPage:false});
      if(kind==='aish'){
        await scene.getByRole('button',{name:'Check this folder',exact:true}).click();
        await scene.getByRole('button',{name:'Explain',exact:true}).click();
        const request=await scene.locator('.shell-request').boundingBox();
        const proposal=await scene.locator('.shell-proposal').boundingBox();
        const actions=await scene.locator('.shell-actions').boundingBox();
        if(width<900) expect(request!.y+request!.height).toBeLessThanOrEqual(proposal!.y);
        expect(proposal!.y+proposal!.height).toBeLessThanOrEqual(actions!.y);
        await scene.screenshot({path:`output/aish-expanded-${width}.png`});
      }
    }
  }
  await page.setViewportSize({width:1440,height:900});await page.goto('/research');
  await page.screenshot({path:'output/research-hub-desktop.png'});
});
