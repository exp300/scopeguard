// Brazilian Portuguese version of red-flag clauses. Slugs match English for URL consistency.

export const clauseCategoriesPt = [
  { id: 'scope', name: 'Escopo e Entregáveis' },
  { id: 'ip', name: 'Propriedade Intelectual' },
  { id: 'noncompete', name: 'Não Concorrência e Exclusividade' },
  { id: 'payment', name: 'Termos de Pagamento' },
  { id: 'liability', name: 'Responsabilidade e Indenização' },
  { id: 'termination', name: 'Rescisão' },
];

export const clausesPt = [
  {
    slug: 'unlimited-revisions',
    category: 'scope',
    title: 'Revisões Ilimitadas',
    searchTerm: 'cláusula revisões ilimitadas contrato freelancer',
    metaDescription:
      'A cláusula de "revisões ilimitadas" transforma um projeto de preço fixo em um contrato de trabalho perpétuo. Aqui está por que é perigosa e como reescrevê-la.',
    example: '"O contratado fornecerá revisões até o cliente ficar satisfeito."',
    danger:
      'Não há limite para o seu tempo. O cliente pode pedir mudanças para sempre sem um fim claro, transformando um projeto de preço fixo em um contrato de trabalho perpétuo. A frase "até ficar satisfeito" é subjetiva. Não há um gatilho objetivo que diga que o projeto está concluído, então você efetivamente trabalha conforme o humor do cliente, não conforme um ponto final definido.',
    fix: 'Especifique o número exato incluído: "Estão incluídas até 3 rodadas de revisões. Rodadas adicionais são cobradas a R$X/h." Defina o que conta como uma rodada: "Uma rodada de revisões consiste em todos os comentários consolidados entregues em uma única resposta escrita dentro de 5 dias úteis após a entrega."',
    realScenario:
      'Um designer de logos assina um projeto de R$5.000 com "revisões ilimitadas." Três meses depois, ele já fez 27 revisões em 14 conceitos diferentes. O cliente continua mudando o objetivo. O designer não pode sair porque o contrato diz "até ficar satisfeito", e acaba ganhando cerca de R$30/hora quando finalmente concorda com o lançamento.',
  },
  {
    slug: 'all-necessary-work',
    category: 'scope',
    title: 'Todo o Trabalho Necessário',
    searchTerm: 'cláusula todo trabalho necessário contrato freelancer',
    metaDescription:
      '"Todo o trabalho necessário" parece razoável, mas é um cheque em branco que permite ao cliente adicionar trabalho não pago. Aqui está a alternativa mais segura.',
    example: '"O contratado realizará todo o trabalho necessário para concluir o projeto."',
    danger:
      '"Necessário" é definido pelo cliente, não por você. Esta cláusula é um cheque em branco: o cliente pode continuar adicionando tarefas sob o pretexto de serem "necessárias" para concluir o projeto. O que o cliente acha "necessário para o lançamento" pode crescer e incluir configuração de analytics, integrações de terceiros, vídeos de treinamento e suporte contínuo, nenhum dos quais estava no seu orçamento original.',
    fix: 'Substitua por um Escopo de Trabalho detalhado. Qualquer coisa não listada fica explicitamente excluída: "Os entregáveis listados na Seção 2 são o escopo completo. Qualquer trabalho não descrito neste SOW exige uma ordem de mudança escrita, assinada por ambas as partes, antes que o contratado comece o trabalho adicional."',
    realScenario:
      'Um desenvolvedor web concorda em "construir o site com todo o trabalho necessário para o lançamento." O cliente depois argumenta que configuração de SEO, integração com Google Analytics, formulário de newsletter e página 404 personalizada são todos "necessários." O desenvolvedor não tem base contratual para recusar e queima 30 horas não pagas.',
  },
  {
    slug: 'final-approval-payment',
    category: 'scope',
    title: 'Pagamento Mediante Aprovação Final do Cliente',
    searchTerm: 'pagamento aprovação final contrato freelancer',
    metaDescription:
      'Atrelar seu pagamento à "aprovação do cliente" permite que ele adie o pagamento indefinidamente. Aqui está por que é perigoso e como corrigir.',
    example: '"O pagamento é devido mediante aprovação do cliente sobre os entregáveis finais."',
    danger:
      'O cliente pode adiar ou reter a aprovação indefinidamente, o que significa que você nunca recebe. Não há nenhum incentivo para ele aprovar, porque assim que aprova, ele te deve dinheiro. Enquanto continuar achando "mais uma coisinha," ele fica com o seu trabalho de graça. Esta é uma das formas mais comuns dos freelancers ficarem sem receber o pagamento final.',
    fix: '"O pagamento final é devido em até 14 dias após a entrega, independentemente da aprovação do cliente. Comentários recebidos após a data de vencimento do pagamento serão tratados em um engajamento pago separado." Adicione uma definição clara de entrega: "Entrega significa que o contratado forneceu os entregáveis acordados no formato acordado por e-mail ou drive compartilhado."',
    realScenario:
      'Uma redatora entrega o copy de um site no dia 1 de julho. O cliente diz "ficou ótimo, deixa eu compartilhar com a equipe." Seis semanas depois ainda estão "coletando feedback." A redatora não tem poder de barganha porque o pagamento final está atrelado à aprovação. Acaba aceitando 50% só para fechar o projeto.',
  },
  {
    slug: 'vague-milestones',
    category: 'scope',
    title: 'Marcos Definidos de Forma Vaga',
    searchTerm: 'marcos vagos contrato freelancer fases',
    metaDescription:
      'Quando "Fase 1: Design" pode significar qualquer coisa, você e seu cliente vão inevitavelmente discutir se a fase está concluída. Defina marcos com entregáveis específicos.',
    example: '"Fase 1: Design. Fase 2: Desenvolvimento. Fase 3: Lançamento."',
    danger:
      'Ninguém consegue concordar sobre o que "design completo" significa. Isso leva a disputas intermináveis sobre se uma fase está concluída, o que significa que você não pode faturar fases concluídas, o que significa que o fluxo de caixa fica travado. Marcos vagos também convidam o scope creep, porque os clientes ficam "polindo" a Fase 1 para sempre em vez de avançar.',
    fix: 'Defina cada marco com entregáveis específicos e mensuráveis: "Fase 1 concluída ao entregar 3 mockups da homepage no Figma com um protótipo clicável, mais documentação escrita do design system. O cliente tem 5 dias úteis para fornecer comentários consolidados ou a fase é automaticamente considerada aprovada." Faça a conclusão objetiva e com prazo definido.',
    realScenario:
      'O contrato de um designer diz "Fase 1: Descoberta, R$15.000." Após 3 semanas de pesquisa, entrevistas e um documento de estratégia, o cliente se recusa a pagar porque "a descoberta não está terminada, ainda não finalizamos a estratégia." O designer não tem definição contratual de "terminado," então continua trabalhando mais 2 semanas de graça.',
  },

  // ─── IP ────────────────────────────────────────────────────────────────
  {
    slug: 'work-for-hire-full-ip-transfer',
    category: 'ip',
    title: 'Trabalho por Encomenda com Transferência Total de PI',
    searchTerm: 'trabalho por encomenda freelancer work for hire',
    metaDescription:
      '"Trabalho por encomenda" parece padrão, mas tira seus direitos de portfólio e muitas vezes nem protege legalmente o cliente. Aqui está a melhor forma de tratar a PI.',
    example: '"Todo o produto de trabalho criado sob este acordo é considerado trabalho feito por encomenda."',
    danger:
      'Em muitas jurisdições, "trabalho por encomenda" feito por um contratado é uma ficção legal. A doutrina tecnicamente se aplica apenas a empregados na maioria dos estados americanos, então a cláusula pode não transferir a PI da forma que o cliente acredita. E mesmo onde se aplica, você abre mão de todos os direitos, incluindo o de mostrar o trabalho no seu portfólio. Algumas cláusulas vão além e proíbem você de dizer que trabalhou no projeto.',
    fix: 'Mantenha a propriedade até o pagamento integral e reserve direitos de portfólio: "A PI é transferida ao cliente mediante recebimento do pagamento final. O contratado retém o direito irrevogável de exibir o trabalho em portfólio, sites pessoais e estudos de caso, e de se identificar como o criador. O cliente concede ao contratado uma licença livre de royalties para esses fins."',
    realScenario:
      'Uma ilustradora faz um logo para uma startup sob "trabalho por encomenda." Dois anos depois, a startup é adquirida e viraliza. A ilustradora não pode usar o logo no portfólio dela, não pode mencionar que fez, e vê seu melhor trabalho desaparecer do registro público.',
  },
  {
    slug: 'retroactive-ip-assignment',
    category: 'ip',
    title: 'Cessão Retroativa de PI',
    searchTerm: 'cessão retroativa propriedade intelectual contrato freelancer',
    metaDescription:
      'Uma cláusula que cede "todas as invenções durante o prazo" pode levar também seus projetos pessoais. Aqui está como adicionar a ressalva certa.',
    example: '"O contratado cede todas as invenções, ideias e desenvolvimentos feitos durante o prazo deste acordo."',
    danger:
      '"Durante o prazo" pode ser interpretado para incluir projetos pessoais, trabalhos paralelos ou qualquer coisa que você crie enquanto o contrato esteja ativo, mesmo que totalmente sem relação com o negócio do cliente. Se você tem um projeto paralelo que decola depois do engajamento, o cliente poderia plausivelmente reivindicar propriedade parcial.',
    fix: 'Adicione uma ressalva: "Esta cessão é limitada ao produto de trabalho criado especificamente para o cliente e exclui invenções desenvolvidas inteiramente em tempo próprio do contratado, sem usar informações confidenciais, equipamentos ou instalações do cliente, e que não se relacionem com o negócio do cliente ou seu negócio antecipado." Esta linguagem espelha a Seção 2870 do Código do Trabalho da Califórnia, o padrão ouro do mercado.',
    realScenario:
      'Um desenvolvedor constrói um projeto SaaS paralelo nos fins de semana enquanto faz um contrato de 6 meses para uma empresa SaaS. Quando o projeto paralelo começa a ganhar tração, o cliente reivindica que é dele sob a cláusula de cessão de PI, mesmo tendo sido em tempo próprio do desenvolvedor e sem relação com o produto do cliente.',
  },
  {
    slug: 'perpetual-license-without-compensation',
    category: 'ip',
    title: 'Licença Perpétua Sem Vínculo ao Pagamento',
    searchTerm: 'licença perpétua irrevogável contrato freelancer',
    metaDescription:
      'Uma licença perpétua que não depende do pagamento significa que o cliente possui seu trabalho para sempre, mesmo que nunca pague. Aqui está como atrelar a licença ao pagamento.',
    example: '"O cliente concede ao contratado uma licença perpétua e irrevogável para usar os materiais do cliente." (Na prática, costuma estar invertido.)',
    danger:
      'Esta cláusula geralmente aparece invertida em contratos reais: significa que você está dando ao cliente uma licença perpétua e irrevogável para usar seus entregáveis. "Irrevogável" significa que você não pode retirá-la mesmo se o cliente nunca pagar. Combinado com "perpétua," você efetivamente deu seu trabalho de graça se o pagamento não acontecer.',
    fix: '"A licença para usar os entregáveis é condicionada ao pagamento integral de todas as faturas pendentes. Até o recebimento do pagamento integral, o contratado retém os direitos exclusivos sobre todos os entregáveis. O uso dos entregáveis antes do pagamento integral constitui um uso não autorizado." Isso transforma a falta de pagamento em uma questão de violação de direitos autorais em vez de apenas uma dívida, o que é muito mais fácil de fazer cumprir.',
    realScenario:
      'Uma fotógrafa entrega os arquivos finais em alta resolução com uma "licença perpétua e irrevogável" concedida no momento da entrega. O cliente publica as fotos em todos os lugares, depois disputa a fatura e paga 40%. Como a licença foi concedida na entrega (não no pagamento), a fotógrafa não tem como exigir legalmente a remoção.',
  },

  // ─── Non-compete ─────────────────────────────────────────────────────
  {
    slug: 'overly-broad-non-compete',
    category: 'noncompete',
    title: 'Não Concorrência Excessivamente Ampla',
    searchTerm: 'cláusula não concorrência freelancer contrato',
    metaDescription:
      '"Nenhum setor similar por 2 anos" pode arrasar todo o seu mercado. Aqui está como negociar uma não-concorrência razoável e exequível.',
    example: '"O contratado concorda em não prestar serviços a nenhuma empresa de setor similar por 2 anos."',
    danger:
      'Se você é designer web para um restaurante, isso pode te impedir de trabalhar com qualquer restaurante por 2 anos, eliminando uma fatia enorme do seu mercado. Muitas não-concorrências excessivamente amplas não são exequíveis nos tribunais, mas você ainda teria que pagar honorários legais para se defender, e a maioria dos freelancers não pode arcar com isso. Melhor nunca assinar uma.',
    fix: 'Limite drasticamente o escopo, tanto em duração quanto em definição de concorrente: "O contratado concorda em não solicitar diretamente os clientes existentes nomeados do cliente, ou prestar o mesmo serviço específico a [concorrente direto nomeado, ex.: os 3 principais concorrentes listados da Acme Corp] por 6 meses após a conclusão do projeto." Específica, com prazo limitado e restrita.',
    realScenario:
      'Uma freelancer de marketing assina uma não-concorrência que a impede de trabalhar com "qualquer empresa de e-commerce" por 18 meses. Ela é especialista em e-commerce. A cláusula liquida o pipeline dela, e ela passa um ano trabalhando em setores adjacentes que não gosta.',
  },
  {
    slug: 'implied-exclusivity',
    category: 'noncompete',
    title: 'Exclusividade Implícita',
    searchTerm: 'exclusividade implícita contrato freelancer atenção total',
    metaDescription:
      '"Atenção total" parece inofensivo, mas é uma cláusula disfarçada de exclusividade que pode ser usada contra você. Aqui está a linguagem para usar no lugar.',
    example: '"O contratado dedicará atenção e recursos totais aos projetos do cliente."',
    danger:
      '"Atenção total" soa como uma cláusula de exclusividade para um advogado. O cliente pode argumentar depois que você violou o contrato ao aceitar outro trabalho, mesmo que seus outros clientes não tivessem nada a ver com o dele. Alguns clientes usam essa linguagem deliberadamente para te trancar em uma exclusividade de fato sem pagar por ela.',
    fix: '"O contratado dedicará esforço profissional razoável para concluir os entregáveis nos prazos acordados. O contratado pode aceitar outros clientes simultaneamente, desde que outros engajamentos não comprometam o cronograma de entrega acordado. O contratado é um contratado independente, não um empregado, e não está sujeito a obrigações de serviço exclusivo."',
    realScenario:
      'Um consultor aceita um engajamento de 3 meses com linguagem de "atenção total." No meio do projeto, o cliente descobre que o consultor tem outro cliente e ameaça processá-lo por quebra de contrato. O consultor ou abandona o outro cliente (perdendo renda) ou enfrenta um processo que provavelmente vence mas não pode bancar.',
  },

  // ─── Payment ───────────────────────────────────────────────────────────
  {
    slug: 'net-60-payment-terms',
    category: 'payment',
    title: 'Prazo de Pagamento Net-60 ou Mais Longo',
    searchTerm: 'pagamento net 60 contrato freelancer',
    metaDescription:
      'Net-60 significa que você financia o negócio do cliente por 2 meses a cada fatura. Aqui está por que isso destrói seu fluxo de caixa e como negociar prazos mais curtos.',
    example: '"As faturas vencem Net-60 a partir da data de recebimento."',
    danger:
      'Você está financiando o negócio do cliente por 2 meses em cada fatura. Em escala, isso destrói seu fluxo de caixa, e clientes que pagam mal sempre vão até o limite. Uma fatura Net-60 de 1 de junho nem está tecnicamente atrasada até 1 de agosto, e a maioria dos clientes corporativos adiciona mais 2 semanas de "tempo de processamento" em cima. Você pode estar fazendo o trabalho e esperando 90+ dias para receber.',
    fix: 'Negocie Net-14 ou Net-30 no máximo. Adicione juros de mora com força: "Faturas não pagas 30 dias após a data de vencimento acumulam juros mensais de 1,5%, mais custos de cobrança e honorários advocatícios razoáveis se a cobrança se tornar necessária." Exija 50% adiantado em projetos acima de R$X. Para engajamentos contínuos, faturamento semanal ou quinzenal em vez de mensal.',
    realScenario:
      'Uma agência de desenvolvimento ganha um cliente "incrível" Fortune 500 com prazo Net-60. No mês 3 já completaram R$200K de trabalho mas receberam R$0. No mês 5 ainda estão "na fila do contas a pagar." A agência precisa pegar uma linha de crédito para pagar a folha enquanto espera um recebimento garantido.',
  },
  {
    slug: 'payment-tied-to-third-party',
    category: 'payment',
    title: 'Pagamento Atrelado à Aprovação de Terceiros',
    searchTerm: 'pagamento contingente aprovação gerencial contrato',
    metaDescription:
      'Pagamento "sujeito à aprovação gerencial" ou "após o fechamento da rodada de captação" te faz carregar o risco da decisão de outro. Aqui está como remover isso.',
    example: '"O pagamento está condicionado à aprovação da gerência do cliente / ao fechamento da rodada de captação."',
    danger:
      'Você não tem nenhum controle sobre se o gerente dele aprova ou se a rodada de captação fecha. Você já fez o trabalho. Rodadas de captação atrasam o tempo todo. Gerentes saem da empresa. Política interna muda da noite para o dia. Nenhuma dessas coisas deveria afetar se você é pago por trabalho que já terminou. Esta cláusula transfere o risco do negócio do cliente para você.',
    fix: 'Remova completamente a linguagem condicional. Atrele o pagamento à sua entrega, não aos processos internos deles: "O pagamento vence em 14 dias a partir da data da fatura. Aprovações internas, eventos de captação ou atrasos de processamento de terceiros não estendem a data de vencimento do pagamento." Se eles insistirem, peça um depósito adiantado em vez disso.',
    realScenario:
      'Um designer assina um acordo "condicionado à Série A" com uma startup, apostando que a rodada vai fechar. Não fecha. A startup pivota, o projeto é arquivado, e o designer fica devendo R$80K sem direito contratual de cobrar: ele aceitou explicitamente que o pagamento era condicional.',
  },
  {
    slug: 'no-kill-fee',
    category: 'payment',
    title: 'Sem Taxa de Cancelamento',
    searchTerm: 'kill fee taxa cancelamento contrato freelancer',
    metaDescription:
      'Se um cliente cancelar no meio do projeto e seu contrato não tiver taxa de cancelamento, você pode perder meses de receita prevista. Aqui está a linguagem a adicionar.',
    example: '(Ausência de qualquer cláusula de rescisão ou compensação por cancelamento)',
    danger:
      'Se o projeto for cancelado no meio, você não recebe nada pelo trabalho concluído a menos que já tenha faturado. Projetos são cancelados o tempo todo, frequentemente logo depois que você fez a parte mais difícil (pesquisa, estratégia, primeiros rascunhos) mas antes da entrega final. Sem uma taxa de cancelamento, o cliente fica com o trabalho em estágio inicial pelo que já foi pago, e você come o resto do prejuízo.',
    fix: '"Se o cliente rescindir o projeto por qualquer motivo, todo o trabalho concluído até a data é faturado à tarifa acordada e vence imediatamente. Aplica-se uma taxa de cancelamento equivalente a 25% do valor restante do contrato, devida em até 14 dias do aviso de rescisão. Quaisquer depósitos pagos são não reembolsáveis." Para projetos por fases, considere depósitos de fase não reembolsáveis.',
    realScenario:
      'Uma designer de marca está 60% concluída em um rebrand de R$80K quando o cliente é adquirido e o projeto é cancelado. Sem taxa de cancelamento, ela já faturou R$32K, e ficou devendo R$48K de receita prevista sem reivindicação contratual. A empresa adquirente nunca retoma o projeto.',
  },

  // ─── Liability ─────────────────────────────────────────────────────────
  {
    slug: 'unlimited-liability',
    category: 'liability',
    title: 'Responsabilidade Ilimitada',
    searchTerm: 'cláusula responsabilidade ilimitada contratado',
    metaDescription:
      '"Responsável por todos os danos" é aberto e perigoso: um pequeno bug pode te expor a reivindicações em escala empresarial. Aqui está o limite de responsabilidade padrão.',
    example: '"O contratado será responsável por todos os danos decorrentes deste acordo."',
    danger:
      '"Todos os danos" pode incluir danos consequenciais, indiretos e punitivos. Um bug em uma landing page poderia teoricamente te expor à responsabilidade por toda a receita perdida do cliente. Um erro de digitação no copy poderia ser enquadrado como causador de um lançamento fracassado. A exposição financeira é ilimitada, então um único projeto pode te levar à falência se algo der errado.',
    fix: '"A responsabilidade cumulativa total do contratado sob este acordo, independentemente da forma da ação, não excederá os honorários pagos ao contratado nos 3 meses imediatamente anteriores à reivindicação. Nenhuma das partes será responsável por danos indiretos, consequenciais, especiais, incidentais ou punitivos, incluindo lucros cessantes ou perda de dados, mesmo se avisada da possibilidade de tais danos."',
    realScenario:
      'Um desenvolvedor sobe uma página de checkout com um bug que falha intermitentemente no Safari. O cliente reivindica R$800K em "vendas perdidas durante a janela do bug" e exige que o desenvolvedor cubra. Com responsabilidade ilimitada, o desenvolvedor não tem teto contratual para apontar e enfrenta uma ameaça legal real, mesmo que o bug genuinamente não fosse culpa dele.',
  },
  {
    slug: 'one-way-indemnification',
    category: 'liability',
    title: 'Indenização Unilateral',
    searchTerm: 'indenização unilateral contrato freelancer',
    metaDescription:
      'Se você indeniza o cliente mas ele não indeniza você, você está pagando os custos legais dele por coisas fora do seu controle. Torne mútua.',
    example: '"O contratado deverá indenizar, defender e isentar o cliente de quaisquer reivindicações decorrentes do trabalho do contratado."',
    danger:
      'Se a indenização flui apenas em uma direção (contratado → cliente), você está cobrindo os custos legais do cliente mesmo quando a reivindicação não tem nada a ver com seu trabalho. Um terceiro processa o cliente sobre como o cliente usou seus entregáveis, e você paga os advogados. Indenização unilateral é uma bandeira vermelha grande em qualquer contrato.',
    fix: 'Exija indenização mútua, em que cada parte indeniza a outra por seus próprios atos, com ressalvas para negligência grave ou má conduta dolosa do indenizante. "Cada parte deverá indenizar, defender e isentar a outra de reivindicações de terceiros decorrentes apenas de negligência grave, má conduta dolosa ou violação material deste acordo pela parte indenizante. Nenhuma das partes será responsável por atos ou omissões da outra."',
    realScenario:
      'O cliente de uma consultora é processado por um concorrente por causa de uma campanha de marketing. A campanha usou um posicionamento de mercado que o cliente decidiu. Sob uma indenização unilateral, a consultora fica responsável por bancar a defesa legal do cliente, mesmo não tendo tido papel algum na decisão estratégica questionada.',
  },
  {
    slug: 'ip-indemnification-without-boundaries',
    category: 'liability',
    title: 'Indenização de PI sem Limites',
    searchTerm: 'indenização propriedade intelectual freelancer materiais cliente',
    metaDescription:
      'Garantir que "os entregáveis não infringem PI" também te torna responsável pelos materiais fornecidos pelo cliente. Aqui está como limitar a garantia ao seu próprio trabalho.',
    example: '"O contratado garante que os entregáveis não infringem nenhum direito de propriedade intelectual de terceiros."',
    danger:
      'Você não pode controlar o que o cliente fornece: logos, imagens de banco, copy, fontes, ativos de terceiros que ele diz ter os direitos. Se materiais fornecidos pelo cliente infringirem, você ainda pode ficar enrolado porque a garantia cobre "os entregáveis" sem distinguir o que veio de você vs. o que veio dele. Mesmo se você reclamar depois, já assinou a garantia.',
    fix: '"O contratado garante que os elementos originais criados pelo contratado não infringem, conscientemente, direitos de PI de terceiros. O cliente declara e garante que todos os materiais fornecidos ao contratado (incluindo, sem limitação, logos, imagens, fontes, copy e ativos de terceiros) são de propriedade do cliente ou devidamente licenciados para o uso pretendido, e o cliente indenizará o contratado por quaisquer reivindicações de infração relacionadas a materiais fornecidos pelo cliente."',
    realScenario:
      'Uma designer web integra uma fonte que o cliente forneceu. O cliente na verdade não tinha a licença comercial. A fundição de tipos manda uma carta de infração de seis dígitos, e sob a garantia original, a designer é nomeada co-ré. Sem a ressalva, ela divide os custos legais.',
  },

  // ─── Termination ───────────────────────────────────────────────────────
  {
    slug: 'termination-for-convenience-no-compensation',
    category: 'termination',
    title: 'Rescisão por Conveniência sem Compensação',
    searchTerm: 'rescisão por conveniência contrato freelancer',
    metaDescription:
      'Uma cláusula de rescisão com "7 dias de aviso por escrito" sem taxa de cancelamento permite que clientes saiam dias antes do lançamento sem pagar nada extra. Aqui está a linguagem mais segura.',
    example: '"Qualquer das partes pode rescindir este acordo com 7 dias de aviso por escrito."',
    danger:
      'O cliente pode dar para trás 7 dias antes do lançamento, depois de você ter feito 95% do trabalho, e legalmente não te dever nada além do que foi faturado. Esta cláusula é mais frequentemente abusada no pior momento possível: bem quando o defensor interno deles sai, ou o orçamento é cortado, ou um concorrente oferece mais barato. A janela de 7 dias dá ao cliente uma opção gratuita de cancelar, paga por você.',
    fix: 'Atrele a rescisão por conveniência a uma taxa de cancelamento mais o pagamento por todo o trabalho concluído: "A rescisão por conveniência exige (a) pagamento por todo o trabalho concluído até a data, calculado pela tarifa horária do contratado ou tarifa pro-rata do projeto; (b) uma taxa de cancelamento equivalente a 20% do valor não pago do contrato; e (c) 14 dias de aviso por escrito. A rescisão por justa causa exige 30 dias de aviso e oportunidade de sanar."',
    realScenario:
      'Um desenvolvedor está 80% concluído em um projeto de R$120K. O novo VP do cliente quer "reavaliar fornecedores" e rescinde com 7 dias de aviso. O contrato do desenvolvedor diz que ele só recebe pelo trabalho faturado. Ele faturou R$60K dos R$120K, então sai com R$60K a menos sem recurso: meses de trabalho bloqueando o pipeline pela metade do pagamento acordado.',
  },
  {
    slug: 'indefinite-pause-clause',
    category: 'termination',
    title: 'Direito do Cliente de Pausar Indefinidamente',
    searchTerm: 'cláusula pausa projeto contrato freelancer',
    metaDescription:
      'Uma cláusula de pausa-quando-quiser permite que o cliente congele seu projeto por meses enquanto você não pode aceitar outro trabalho. Aqui está como limitar pausas no tempo.',
    example: '"O cliente pode pausar o projeto a qualquer momento mediante aviso por escrito."',
    danger:
      'Você bloqueou esse cliente na sua agenda. Uma "pausa" que dura 6 meses significa que você não pode aceitar outro trabalho e não está sendo pago. Pior, quando o cliente despausa, ele espera que você largue tudo e retome, o que significa que você não pode se comprometer com outros clientes nesse meio tempo. Cláusulas de pausa são, de fato, opções gratuitas e ilimitadas sobre o seu tempo.',
    fix: '"O projeto pode ser pausado por até 30 dias com aviso por escrito. Pausas que excedam 30 dias são tratadas como rescisões e ativam a cláusula de taxa de cancelamento. O re-engajamento após a rescisão exige um novo SOW e um novo depósito. A tarifa horária do contratado pode ser ajustada para qualquer novo SOW."',
    realScenario:
      'O cliente de um consultor pausa um engajamento de R$200K "por algumas semanas" enquanto reestrutura. Cinco meses depois finalmente entram em contato para retomar. O consultor teve que recusar trabalho o tempo todo, e depois tem que dar prioridade imediata ao projeto retomado. Efeito líquido: 5 meses de receita perdida mais entrega apressada.',
  },
];

export function getClausePt(slug) {
  return clausesPt.find(c => c.slug === slug);
}

export function getRelatedClausesPt(slug, limit = 3) {
  const current = getClausePt(slug);
  if (!current) return [];
  const sameCategory = clausesPt.filter(c => c.category === current.category && c.slug !== slug);
  const otherCategory = clausesPt.filter(c => c.category !== current.category);
  return [...sameCategory, ...otherCategory].slice(0, limit);
}

export function getCategoryNamePt(id) {
  return clauseCategoriesPt.find(c => c.id === id)?.name || '';
}
