(function(){
  const q=(stem,stemZh,options,answer,explanation,explanationZh,extra={})=>({stem,stemZh,options,optionsZh:options,answer,explanation,explanationZh,...extra});
  const packs={
    'straight-lines':{title:'Equations of straight lines',topic:'Straight lines',questions:[
      q('Find the gradient of the line through (−2, 3) and (4, 15).','求通過 (−2, 3) 及 (4, 15) 的直線斜率。',['−2','1/2','2','3'],2,'m = (15 − 3) ÷ (4 − (−2)) = 2.','m = (15 − 3) ÷ (4 − (−2)) = 2。',{notation:'m = (y₂ − y₁)/(x₂ − x₁)',visual:'points'}),
      q('Which equation is parallel to y = 3x − 5 and passes through (2, 4)?','哪一條直線通過 (2, 4) 且與 y = 3x − 5 平行？',['y = 3x − 2','y = 3x + 2','y = −3x + 10','y = x + 2'],0,'A parallel line has gradient 3. Substituting (2, 4) into y = 3x + c gives c = −2.','平行線斜率為 3。代入 (2, 4) 至 y = 3x + c，得 c = −2。',{visual:'parallel'}),
      q('A line has equation 2x + 5y = 20. What is its y-intercept?','直線方程為 2x + 5y = 20。它的 y 截距是多少？',['2','4','5','10'],1,'At the y-intercept x = 0, so y = 4.','在 y 截距處 x = 0，所以 y = 4。',{visual:'intercept'}),
      q('Which line is perpendicular to 4x − 2y + 7 = 0?','哪一條直線與 4x − 2y + 7 = 0 垂直？',['y = 2x + 1','y = −2x + 1','y = 1/2x + 1','y = −1/2x + 1'],3,'The given gradient is 2, so a perpendicular gradient is −1/2.','原直線斜率為 2，因此垂直線斜率為 −1/2。',{visual:'perpendicular'}),
      q('The line y = kx + 6 passes through (−3, 0). Find k.','直線 y = kx + 6 通過 (−3, 0)。求 k。',['−2','−1/2','1/2','2'],3,'0 = −3k + 6, hence k = 2.','0 = −3k + 6，因此 k = 2。'),
      q('The lines y = 2x + 1 and y = −x + 7 meet at P. Find the x-coordinate of P.','直線 y = 2x + 1 與 y = −x + 7 相交於 P。求 P 的 x 坐標。',['1','2','3','4'],1,'Equating gives 2x + 1 = −x + 7, so x = 2.','令兩式相等，得 2x + 1 = −x + 7，所以 x = 2。',{visual:'intersection'}),
      q('A line has gradient −3 and y-intercept 8. Where does it cross the x-axis?','一直線的斜率為 −3，y 截距為 8。它在何處與 x 軸相交？',['(8/3, 0)','(3/8, 0)','(0, 8/3)','(0, 8)'],0,'Set y = 0 in y = −3x + 8, giving x = 8/3.','在 y = −3x + 8 中令 y = 0，得 x = 8/3。',{visual:'intercept'}),
      q('Points A(1, 5), B(3, 9) and C(7, p) are collinear. Find p.','A(1, 5)、B(3, 9) 及 C(7, p) 三點共線。求 p。',['13','15','17','19'],2,'AB has gradient 2. From x = 3 to 7, y increases by 8, so p = 17.','AB 的斜率為 2。x 由 3 增至 7 時，y 增加 8，因此 p = 17。',{visual:'points'})
    ]},
    'trigonometry-1':{title:'Trigonometry I',topic:'Trigonometry',questions:[
      q('In a right triangle, the opposite side is 6 cm and the hypotenuse is 10 cm. Find sin θ.','一直角三角形中，θ 的對邊為 6 cm，斜邊為 10 cm。求 sin θ。',['3/5','4/5','3/4','5/3'],0,'sin θ = opposite ÷ hypotenuse = 3/5.','sin θ = 對邊 ÷ 斜邊 = 3/5。',{visual:'triangle'}),
      q('Find tan 45°.','求 tan 45°。',['0','1','√2','Undefined'],1,'The legs of a 45°–45°–90° triangle are equal.','45°–45°–90° 三角形的兩直角邊相等。',{visual:'triangle'}),
      q('If cos θ = 12/13 and θ is acute, find sin θ.','若 cos θ = 12/13 且 θ 為銳角，求 sin θ。',['5/13','12/13','5/12','13/5'],0,'Use the 5–12–13 right triangle.','利用 5–12–13 直角三角形。',{visual:'triangle'}),
      q('From a point 20 m from a tower, the angle of elevation is 35°. Which expression gives its height h?','在距離塔 20 m 處，仰角為 35°。哪一算式可求塔高 h？',['20 sin 35°','20 cos 35°','20 tan 35°','20 ÷ sin 35°'],2,'tan 35° = h/20, so h = 20 tan 35°.','tan 35° = h/20，所以 h = 20 tan 35°。',{visual:'elevation'}),
      q('A ladder 5 m long reaches 4 m up a wall. How far is its foot from the wall?','一把 5 m 長的梯子靠牆，高度達 4 m。梯腳離牆多遠？',['1 m','2 m','3 m','4 m'],2,'By Pythagoras, d² + 4² = 5², so d = 3.','由畢氏定理，d² + 4² = 5²，所以 d = 3。',{visual:'ladder'}),
      q('For 0° < θ < 90°, sin θ = cos θ. Find θ.','若 0° < θ < 90° 且 sin θ = cos θ，求 θ。',['30°','45°','60°','90°'],1,'Dividing by cos θ gives tan θ = 1.','兩邊除以 cos θ，得 tan θ = 1。',{visual:'triangle'}),
      q('A right triangle has legs 8 and 15. Find the hypotenuse.','一直角三角形的兩直角邊為 8 及 15。求斜邊。',['16','17','18','23'],1,'√(8² + 15²) = √289 = 17.','√(8² + 15²) = √289 = 17。',{visual:'triangle'}),
      q('Which ratio equals 1/cos θ?','哪一比值等於 1/cos θ？',['hypotenuse/adjacent','adjacent/hypotenuse','opposite/adjacent','hypotenuse/opposite'],0,'cos θ = adjacent/hypotenuse, so invert the ratio.','cos θ = 鄰邊/斜邊，所以取其倒數。',{visual:'triangle'})
    ]},
    'jlpt-n5-grammar':{title:'N5の文法',topic:'JLPT N5 · 文法',noTranslate:true,questions:[
      {stem:'わたしは 毎朝 7時（　）起きます。',options:['を','に','で','へ'],answer:1,type:'文の文法',instruction:'（　）に入るものを一つ選んでください。',explanation:'時刻には助詞「に」を使います。'},
      {stem:'これは だれ（　）かばんですか。',options:['が','の','を','に'],answer:1,type:'文の文法',instruction:'（　）に入るものを一つ選んでください。',explanation:'持ち主は「だれのかばん」で表します。'},
      {stem:'きのう、図書館で 本を（　）。',options:['読みます','読みました','読みません','読むです'],answer:1,type:'文の文法',instruction:'一番よいものを一つ選んでください。',explanation:'「きのう」は過去なので「読みました」が合います。'},
      {stem:'つくえの 上（　）本が あります。',options:['が','に','を','で'],answer:1,type:'文の文法',instruction:'（　）に入るものを一つ選んでください。',explanation:'存在する場所は「場所に あります」で表します。'},
      {stem:'A「いっしょに 昼ごはんを 食べませんか。」 B「（　）。」',options:['はい、食べません','いいですね','ごちそうさま','ただいま'],answer:1,type:'会話表現',instruction:'会話に合うものを一つ選んでください。',explanation:'誘いに賛成する自然な返事は「いいですね」です。'},
      {stem:'田中さんは 日本語（　）英語も 話します。',options:['と','や','も','で'],answer:0,type:'文の文法',instruction:'（　）に入るものを一つ選んでください。',explanation:'二つの名詞を並べるとき「AとB」を使います。'},
      {stem:'この へやは あまり（　）。',options:['広いです','広くないです','広かったです','広くです'],answer:1,type:'文の文法',instruction:'一番よいものを一つ選んでください。',explanation:'「あまり」は普通、否定形と一緒に使います。'},
      {stem:'雨です（　）、かさを 持っていきます。',options:['から','まで','でも','しか'],answer:0,type:'文の文法',instruction:'（　）に入るものを一つ選んでください。',explanation:'理由を表す接続助詞は「から」です。'}
    ]},
    'jlpt-n5-vocab-grammar':{title:'N5の語彙と文法',topic:'JLPT N5 · 語彙',noTranslate:true,questions:[
      {stem:'「川」の 読み方は どれですか。',options:['かわ','やま','うみ','そら'],answer:0,type:'漢字読み',instruction:'一番よい読み方を一つ選んでください。',explanation:'「川」は「かわ」と読みます。'},
      {stem:'「大きい」の 反対は どれですか。',options:['小さい','高い','新しい','長い'],answer:0,type:'語彙',instruction:'意味が反対のことばを選んでください。',explanation:'「大きい」の反対は「小さい」です。'},
      {stem:'日曜日の 次の日は（　）です。',options:['火曜日','月曜日','土曜日','金曜日'],answer:1,type:'語彙',instruction:'（　）に入るものを一つ選んでください。',explanation:'日曜日の次は月曜日です。'},
      {stem:'さむいので、まどを（　）ください。',options:['あけて','しめて','つけて','けして'],answer:1,type:'文脈規定',instruction:'文の意味に合うことばを選んでください。',explanation:'寒いときは窓を「しめて」ほしいという意味が自然です。'},
      {stem:'「食べ物」は どれですか。',options:['本','水','パン','車'],answer:2,type:'語彙',instruction:'一番よいものを一つ選んでください。',explanation:'パンは食べ物です。'},
      {stem:'駅まで（　）で 行きます。',options:['くつ','でんしゃ','つくえ','てがみ'],answer:1,type:'文脈規定',instruction:'文の意味に合うことばを選んでください。',explanation:'交通手段として「でんしゃ」が合います。'},
      {stem:'「先生」は どの人ですか。',options:['学校で 教える人','病院で はたらく人','店で 物を 売る人','車を 運転する人'],answer:0,type:'言い換え類義',instruction:'意味が一番近いものを選んでください。',explanation:'先生は学校などで教える人です。'},
      {stem:'きょうは いそがしいです。あした（　）話しましょう。',options:['また','まだ','だけ','すぐ'],answer:0,type:'用法',instruction:'文に合うことばを一つ選んでください。',explanation:'別の機会を表す「また」が自然です。'}
    ]}
  };
  Object.assign(window.EXAI_DEMO_PACKS||(window.EXAI_DEMO_PACKS={}),packs);
})();
