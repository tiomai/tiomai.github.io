window.EXAI_DEMO_PACKS={
  'math-s4':{title:'Math S4',topic:'Mixed Mathematics',questions:[
    {stem:'The graph shows the parabola C: y = x² − 2x + 2 and the line l: y = 2x − 2. How many real solutions does x² − 2x + 2 = 2x − 2 have?',stemZh:'圖中顯示拋物線 C：y = x² − 2x + 2 及直線 l：y = 2x − 2。方程 x² − 2x + 2 = 2x − 2 有多少個實數解？',options:['0','1','2','3'],optionsZh:['0','1','2','3'],answer:1,explanation:'Set the two equations equal: x² − 4x + 4 = 0, so (x − 2)² = 0. There is one repeated real solution.',explanationZh:'令兩式相等：x² − 4x + 4 = 0，即 (x − 2)² = 0，因此只有一個重根實數解。'},
    {stem:'Solve 3x − 7 = 11.',stemZh:'解方程 3x − 7 = 11。',options:['x = 4','x = 5','x = 6','x = 7'],optionsZh:['x = 4','x = 5','x = 6','x = 7'],answer:2,explanation:'Add 7 to both sides to get 3x = 18, then divide by 3. Therefore x = 6.',explanationZh:'兩邊加 7，得到 3x = 18，再除以 3，因此 x = 6。'},
    {stem:'If f(x) = 2x² − 3, find f(2).',options:['1','5','8','11'],answer:1},
    {stem:'The mean of 4, 7, 9 and x is 8. Find x.',options:['10','11','12','13'],answer:2},
    {stem:'Which expression is equivalent to (a + 3)(a − 3)?',options:['a² − 9','a² + 9','a² − 6a + 9','a² + 6a + 9'],answer:0}
  ]},
  'straight-lines':{title:'Equations of straight lines',topic:'Straight lines',questions:[
    {stem:'Find the equation of the line parallel to 3x − y + 4 = 0 and passing through (2, −1).',stemZh:'求通過 (2, −1) 且與 3x − y + 4 = 0 平行的直線方程。',options:['y = −3x − 7','y = 3x + 7','y = 3x − 7','y = −3x + 7'],optionsZh:['y = −3x − 7','y = 3x + 7','y = 3x − 7','y = −3x + 7'],answer:2,explanation:'The given line has gradient 3. A parallel line is y = 3x + c. Substituting (2, −1) gives c = −7.',explanationZh:'原直線斜率為 3。平行線可寫成 y = 3x + c。代入 (2, −1)，得 c = −7。'},
    {stem:'What is the gradient of the line through (1, 2) and (5, 10)?',options:['1/2','2','4','8'],answer:1},
    {stem:'Which line is perpendicular to y = ½x + 4?',options:['y = 2x + 1','y = −2x + 1','y = −½x + 1','y = ½x − 1'],answer:1},
    {stem:'The line y = 3x + c passes through (2, 1). Find c.',options:['−7','−5','5','7'],answer:1},
    {stem:'Find the x-intercept of 2x + y − 8 = 0.',options:['2','4','6','8'],answer:1}
  ]},
  'trigonometry-1':{title:'Trigonometry I',topic:'Trigonometry',questions:[
    {stem:'In a right-angled triangle, sin θ = 3/5. Find cos θ.',options:['3/4','4/5','5/4','5/3'],answer:1},{stem:'Find tan 45°.',options:['0','1','√2','Undefined'],answer:1},{stem:'If cos θ = 0.6 and θ is acute, find sin θ.',options:['0.4','0.6','0.8','1.0'],answer:2},{stem:'Which ratio equals opposite ÷ hypotenuse?',options:['sine','cosine','tangent','cotangent'],answer:0},{stem:'Find θ if tan θ = 1 and 0° < θ < 90°.',options:['30°','45°','60°','90°'],answer:1}
  ]},
  'circles-basic':{title:'Basic properties of circles',topic:'Circles',questions:[
    {stem:'The angle at the centre is twice the angle at the circumference standing on the same arc. If the circumference angle is 35°, find the centre angle.',options:['35°','55°','70°','145°'],answer:2},{stem:'What angle is formed in a semicircle?',options:['45°','60°','90°','180°'],answer:2},{stem:'A tangent is perpendicular to the radius at the point of contact. What is the angle between them?',options:['0°','45°','90°','180°'],answer:2},{stem:'Equal chords of the same circle subtend what kind of angles at the centre?',options:['Equal','Supplementary','Complementary','Reflex'],answer:0},{stem:'Opposite angles of a cyclic quadrilateral add up to:',options:['90°','120°','180°','360°'],answer:2}
  ]},
  'dispersion':{title:'Measures of dispersion',topic:'Statistics',questions:[
    {stem:'Find the range of 3, 7, 8, 12 and 15.',options:['8','10','12','15'],answer:2},{stem:'Which measure describes the average squared distance from the mean?',options:['Range','Variance','Median','Mode'],answer:1},{stem:'If every value in a data set is increased by 5, what happens to its standard deviation?',options:['It increases by 5','It decreases by 5','It is unchanged','It doubles'],answer:2},{stem:'Which data set has zero variance?',options:['1,1,1,1','1,2,3,4','0,1,0,1','2,2,3,3'],answer:0},{stem:'A smaller standard deviation indicates that values are:',options:['More spread out','Closer to the mean','Always larger','Always negative'],answer:1}
  ]},
  'jlpt-n5-grammar':{title:'N5の文法',topic:'JLPT N5 Grammar',questions:[
    {stem:'わたしは 毎朝 7時（　）起きます。',options:['を','に','で','へ'],answer:1},{stem:'これは だれ（　）かばんですか。',options:['が','の','を','に'],answer:1},{stem:'きのう 学校へ（　）。',options:['行きます','行きません','行きました','行くです'],answer:2},{stem:'つくえの 上（　）本があります。',options:['が','に','を','で'],answer:1},{stem:'コーヒー（　）飲みませんか。',options:['を','が','に','へ'],answer:0}
  ],noTranslate:true},
  'jlpt-n5-vocab-grammar':{title:'N5の語彙と文法',topic:'JLPT N5 Vocabulary',questions:[
    {stem:'「大きい」の反対は どれですか。',options:['小さい','高い','新しい','長い'],answer:0},{stem:'日曜日の 次の日は（　）です。',options:['火曜日','月曜日','土曜日','金曜日'],answer:1},{stem:'毎日 電車（　）会社へ行きます。',options:['を','が','で','に'],answer:2},{stem:'「たべもの」は どれですか。',options:['本','水','パン','車'],answer:2},{stem:'この りんごは 三つ（　）300円です。',options:['を','で','に','が'],answer:1}
  ],noTranslate:true},
  'jlpt-n4-grammar':{title:'N4の文法',topic:'JLPT N4 Grammar · Demo',questions:[
    {stem:'雨が（　）、試合は行われます。',options:['降っても','降るので','降ったら','降りながら'],answer:0,explanation:'「〜ても」 expresses “even if,” which matches the contrast in this sentence.'},{stem:'この薬は食事のあとで（　）ください。',options:['飲んで','飲みて','飲むで','飲み'],answer:0,explanation:'The request pattern is the te-form plus ください.'},{stem:'駅に着いたら、電話を（　）。',options:['かけます','かけました','かけるでした','かけているです'],answer:0,explanation:'The main action after the conditional clause uses a non-past polite form.'},{stem:'日本へ来てから、すしが好きに（　）。',options:['なりました','しました','ありました','いました'],answer:0,explanation:'「好きになる」 means to come to like something.'},{stem:'この本は子ども（　）読みやすいです。',options:['にも','では','から','まで'],answer:0,explanation:'「にも」 indicates that the book is easy even for children.'}
  ],noTranslate:true},
  'jlpt-n3-vocab-grammar':{title:'N3の語彙と文法',topic:'JLPT N3 Vocabulary & Grammar · Demo',questions:[
    {stem:'会議は予定（　）三時に始まった。',options:['どおり','ばかり','ながら','ほど'],answer:0,explanation:'「予定どおり」 means “as scheduled.”'},{stem:'彼は忙しい（　）、手伝ってくれた。',options:['にもかかわらず','について','によって','として'],answer:0,explanation:'「にもかかわらず」 introduces a result contrary to expectation.'},{stem:'この機械を使う（　）、説明書を読んでください。',options:['際に','うちに','かわりに','ところに'],answer:0,explanation:'「際に」 means “when/on the occasion of.”'},{stem:'電車が遅れたため、約束の時間に（　）。',options:['間に合わなかった','追いつかなかった','届かなかった','続かなかった'],answer:0,explanation:'「時間に間に合う」 means to be in time.'},{stem:'この地域では人口が少しずつ（　）いる。',options:['減って','倒して','落として','消して'],answer:0,explanation:'「人口が減る」 is the natural intransitive expression.'}
  ],noTranslate:true},
  'jlpt-n2-grammar':{title:'N2の文法',topic:'JLPT N2 Grammar · Demo',questions:[
    {stem:'経験があるからといって、必ず成功する（　）。',options:['とは限らない','に違いない','わけがないか','ことになった'],answer:0,explanation:'「とは限らない」 means that something is not necessarily true.'},{stem:'この企画は予算（　）、実施方法も見直す必要がある。',options:['のみならず','に反して','を問わず','につれて'],answer:0,explanation:'「のみならず」 adds another item: not only A but also B.'},{stem:'説明を聞けば聞く（　）、疑問が増えてきた。',options:['ほど','だけ','さえ','こそ'],answer:0,explanation:'The pattern 「〜ば〜ほど」 means “the more…, the more…”.'},{stem:'彼の協力（　）、この仕事は完成しなかっただろう。',options:['なしには','に限って','を通じて','に沿って'],answer:0,explanation:'「なしには」 means “without.”'},{stem:'申込者が多い場合は、抽選を行う（　）。',options:['ことがあります','ものがあります','ところです','ばかりです'],answer:0,explanation:'「ことがあります」 expresses that something may occur.'}
  ],noTranslate:true},
  'jlpt-n1-grammar':{title:'N1の文法',topic:'JLPT N1 Grammar · Demo',questions:[
    {stem:'状況が改善しない（　）、計画を続けるのは難しい。',options:['ことには','ものなら','ところを','ばかりに'],answer:0,explanation:'「〜ないことには」 states a necessary condition.'},{stem:'長年の努力があって（　）、今日の成功がある。',options:['こそ','まで','すら','のみ'],answer:0,explanation:'「あってこそ」 emphasizes that the result exists precisely because of the condition.'},{stem:'彼の発言は、誤解を招き（　）表現だった。',options:['かねない','かねる','きれない','ぬく'],answer:0,explanation:'「かねない」 expresses the risk of an undesirable outcome.'},{stem:'この作品は、見る者の心を揺さぶら（　）。',options:['ずにはおかない','ないではない','ざるをえない','ずじまいだ'],answer:0,explanation:'「ずにはおかない」 means something inevitably causes a reaction.'},{stem:'責任者である以上、知らなかったでは（　）。',options:['済まされない','及ばない','かなわない','当たらない'],answer:0,explanation:'「済まされない」 means the excuse is not acceptable.'}
  ],noTranslate:true}
};
