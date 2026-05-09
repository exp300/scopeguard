// Spanish version of red-flag clauses. Slugs match English for URL consistency.

export const clauseCategoriesEs = [
  { id: 'scope', name: 'Alcance y Entregables' },
  { id: 'ip', name: 'Propiedad Intelectual' },
  { id: 'noncompete', name: 'No Competencia y Exclusividad' },
  { id: 'payment', name: 'Términos de Pago' },
  { id: 'liability', name: 'Responsabilidad e Indemnización' },
  { id: 'termination', name: 'Terminación' },
];

export const clausesEs = [
  {
    slug: 'unlimited-revisions',
    category: 'scope',
    title: 'Revisiones Ilimitadas',
    searchTerm: 'cláusula revisiones ilimitadas contrato freelance',
    metaDescription:
      'La cláusula de "revisiones ilimitadas" convierte un proyecto de precio fijo en un contrato de trabajo perpetuo. Aquí explicamos por qué es peligrosa y cómo reescribirla.',
    example: '"El contratista proporcionará revisiones hasta que el cliente quede satisfecho."',
    danger:
      'No hay límite a tu tiempo. El cliente puede pedir cambios para siempre sin un final claro, convirtiendo un proyecto de precio fijo en un contrato de trabajo perpetuo. La frase "hasta que quede satisfecho" es subjetiva. No hay un disparador objetivo que diga que el proyecto está terminado, así que efectivamente trabajas según el humor del cliente, no según un punto final definido.',
    fix: 'Especifica el número exacto incluido: "Se incluyen hasta 3 rondas de revisiones. Las rondas adicionales se facturan a $X/hr." Define qué cuenta como una sola ronda: "Una ronda de revisiones consiste en todos los comentarios consolidados entregados en una sola respuesta escrita dentro de los 5 días hábiles posteriores a la entrega."',
    realScenario:
      'Un diseñador de logos firma un proyecto de $1.500 con "revisiones ilimitadas." Tres meses después, ha hecho 27 revisiones de 14 conceptos diferentes. El cliente sigue moviendo la meta. El diseñador no puede irse porque el contrato dice "hasta que quede satisfecho", y termina ganando aproximadamente $8/hora cuando finalmente se acepta el lanzamiento.',
  },
  {
    slug: 'all-necessary-work',
    category: 'scope',
    title: 'Todo el Trabajo Necesario',
    searchTerm: 'cláusula todo el trabajo necesario contrato',
    metaDescription:
      '"Todo el trabajo necesario" suena razonable, pero es un cheque en blanco que permite al cliente añadir trabajo no remunerado. Aquí está la alternativa más segura.',
    example: '"El contratista realizará todo el trabajo necesario para completar el proyecto."',
    danger:
      '"Necesario" lo define el cliente, no tú. Esta cláusula es un cheque en blanco: el cliente puede seguir añadiendo tareas bajo el pretexto de que son "necesarias" para terminar el proyecto. Lo que el cliente cree "necesario para el lanzamiento" puede crecer hasta incluir configuración de analytics, integraciones de terceros, videos de capacitación y soporte continuo, nada de lo cual estaba en tu cotización original.',
    fix: 'Reemplaza con un Alcance de Trabajo detallado. Cualquier cosa no listada queda explícitamente excluida: "Los entregables listados en la Sección 2 son el alcance completo. Cualquier trabajo no descrito en este SOW requiere una orden de cambio escrita, firmada por ambas partes, antes de que el contratista comience el trabajo adicional."',
    realScenario:
      'Un desarrollador web acepta "construir el sitio web con todo el trabajo necesario para el lanzamiento." El cliente argumenta luego que la configuración de SEO, la integración de Google Analytics, un formulario de newsletter y una página 404 personalizada son todas "necesarias." El desarrollador no tiene base contractual para negarse, y quema 30 horas no pagadas.',
  },
  {
    slug: 'final-approval-payment',
    category: 'scope',
    title: 'Pago contra Aprobación Final del Cliente',
    searchTerm: 'pago contra aprobación final contrato freelance',
    metaDescription:
      'Atar tu pago a la "aprobación del cliente" permite que retrasen el pago indefinidamente. Aquí explicamos por qué es peligroso y cómo arreglarlo.',
    example: '"El pago se debe al recibir la aprobación del cliente sobre los entregables finales."',
    danger:
      'El cliente puede retrasar o retener la aprobación indefinidamente, lo que significa que nunca te pagan. No tienen ningún incentivo para aprobar, porque una vez que aprueben, te deben dinero. Mientras sigan encontrando "una cosa más," conservan tu trabajo gratis. Esta es una de las formas más comunes en que los freelancers se quedan sin cobrar el pago final.',
    fix: '"El pago final se debe dentro de los 14 días posteriores a la entrega, independientemente de la aprobación del cliente. Los comentarios recibidos después de la fecha de vencimiento del pago se atenderán en un compromiso pagado por separado." Añade una definición clara de entrega: "Entrega significa que el contratista ha proporcionado los entregables acordados en el formato acordado por correo electrónico o disco compartido."',
    realScenario:
      'Una redactora entrega el copy de un sitio web el 1 de julio. El cliente dice "se ve genial, déjame compartirlo con el equipo." Seis semanas después siguen "recopilando comentarios." La redactora no tiene poder de negociación porque el pago final está atado a la aprobación. Termina aceptando un 50% solo para cerrar el proyecto.',
  },
  {
    slug: 'vague-milestones',
    category: 'scope',
    title: 'Hitos Definidos de Forma Vaga',
    searchTerm: 'hitos vagos contrato freelance fases',
    metaDescription:
      'Cuando "Fase 1: Diseño" puede significar cualquier cosa, tú y tu cliente discutirán inevitablemente sobre si la fase está terminada. Define hitos con entregables específicos.',
    example: '"Fase 1: Diseño. Fase 2: Desarrollo. Fase 3: Lanzamiento."',
    danger:
      'Nadie puede ponerse de acuerdo sobre qué significa "diseño completo." Esto lleva a disputas interminables sobre si una fase está terminada, lo que significa que no puedes facturar las fases completadas, lo que significa que el flujo de caja se bloquea. Los hitos vagos también invitan al scope creep, porque los clientes siguen "puliendo" la Fase 1 para siempre en lugar de avanzar.',
    fix: 'Define cada hito con entregables específicos y medibles: "Fase 1 completa al entregar 3 maquetas de homepage en Figma con un prototipo clickeable, más documentación escrita del sistema de diseño. El cliente tiene 5 días hábiles para entregar comentarios consolidados o la fase se considera automáticamente aprobada." Haz que la finalización sea objetiva y con plazo.',
    realScenario:
      'El contrato de un diseñador dice "Fase 1: Descubrimiento, $4.000." Después de 3 semanas de investigación, encuestas y un documento de estrategia, el cliente se niega a pagar porque "el descubrimiento no está terminado, todavía no hemos finalizado la estrategia." El diseñador no tiene una definición contractual de "terminado," así que sigue trabajando 2 semanas más gratis.',
  },

  // ─── IP ────────────────────────────────────────────────────────────────
  {
    slug: 'work-for-hire-full-ip-transfer',
    category: 'ip',
    title: 'Trabajo por Encargo con Transferencia Total de PI',
    searchTerm: 'cláusula trabajo por encargo freelance work for hire',
    metaDescription:
      '"Trabajo por encargo" suena estándar, pero te quita los derechos de portafolio y muchas veces ni siquiera protege legalmente al cliente. Aquí la mejor forma de manejar la PI.',
    example: '"Todo el producto de trabajo creado bajo este acuerdo se considera trabajo hecho por encargo."',
    danger:
      'En muchas jurisdicciones, "trabajo por encargo" hecho por un contratista es una ficción legal. La doctrina técnicamente aplica solo a empleados en la mayoría de los estados de EE.UU., así que la cláusula puede no transferir la PI como cree el cliente. E incluso donde sí aplica, renuncias a todos los derechos, incluido el de mostrar el trabajo en tu portafolio. Algunas cláusulas van más lejos y te prohíben decir que trabajaste en el proyecto.',
    fix: 'Retén la propiedad hasta el pago completo y reserva derechos de portafolio: "La PI se transfiere al cliente al recibir el pago final. El contratista conserva el derecho irrevocable de mostrar el trabajo en su portafolio, sitios web personales y casos de estudio, y de identificarse como el creador. El cliente otorga al contratista una licencia libre de regalías para estos propósitos."',
    realScenario:
      'Una ilustradora hace un logo para una startup bajo "trabajo por encargo." Dos años después, la startup es adquirida y se vuelve viral. La ilustradora no puede usar el logo en su portafolio, no puede mencionar que lo hizo, y ve cómo su mejor trabajo desaparece de su registro público.',
  },
  {
    slug: 'retroactive-ip-assignment',
    category: 'ip',
    title: 'Cesión Retroactiva de PI',
    searchTerm: 'cesión retroactiva propiedad intelectual contrato freelance',
    metaDescription:
      'Una cláusula que cede "todas las invenciones durante el plazo" puede llevarse también tus proyectos personales. Aquí cómo añadir la salvedad correcta.',
    example: '"El contratista cede todas las invenciones, ideas y desarrollos hechos durante el plazo de este acuerdo."',
    danger:
      '"Durante el plazo" puede interpretarse como incluyendo proyectos personales, trabajos paralelos o cualquier cosa que crees mientras el contrato esté activo, incluso si no tiene relación con el negocio del cliente. Si tienes un proyecto paralelo que despega después del compromiso, el cliente podría plausiblemente reclamar propiedad parcial.',
    fix: 'Añade una salvedad: "Esta cesión se limita al producto de trabajo creado específicamente para el cliente y excluye invenciones desarrolladas enteramente en el tiempo propio del contratista, sin usar información confidencial, equipo o instalaciones del cliente, y que no se relacionen con el negocio del cliente o su negocio anticipado." Este lenguaje refleja la Sección 2870 del Código Laboral de California, el estándar de oro.',
    realScenario:
      'Un desarrollador construye un proyecto SaaS paralelo los fines de semana mientras hace un contrato de 6 meses para una empresa SaaS. Cuando el proyecto paralelo empieza a tener tracción, el cliente reclama que es suyo bajo la cláusula de cesión de PI, aun cuando fue en tiempo propio del desarrollador y no relacionado con el producto del cliente.',
  },
  {
    slug: 'perpetual-license-without-compensation',
    category: 'ip',
    title: 'Licencia Perpetua sin Vínculo al Pago',
    searchTerm: 'licencia perpetua irrevocable contrato freelance',
    metaDescription:
      'Una licencia perpetua que no depende del pago significa que el cliente posee tu trabajo para siempre, incluso si nunca paga. Aquí cómo atar la licencia al pago.',
    example: '"El cliente otorga al contratista una licencia perpetua e irrevocable para usar los materiales del cliente." (En la práctica, suele estar al revés.)',
    danger:
      'Esta cláusula suele aparecer al revés en contratos reales: significa que tú estás dando al cliente una licencia perpetua e irrevocable para usar tus entregables. "Irrevocable" significa que no puedes retirarla aunque el cliente nunca pague. Combinado con "perpetua," efectivamente has regalado tu trabajo gratis si el pago no llega.',
    fix: '"La licencia para usar los entregables está condicionada al pago completo de todas las facturas pendientes. Hasta recibir el pago completo, el contratista conserva los derechos exclusivos sobre todos los entregables. El uso de los entregables antes del pago completo constituye un uso no autorizado." Esto convierte la falta de pago en un problema de infracción de derechos de autor en lugar de solo una deuda, lo cual es mucho más fácil de hacer cumplir.',
    realScenario:
      'Una fotógrafa entrega los archivos finales en alta resolución con una "licencia perpetua e irrevocable" otorgada al momento de la entrega. El cliente publica las fotos en todas partes, luego disputa la factura y paga el 40%. Como la licencia se otorgó al momento de la entrega (no al pago), la fotógrafa no tiene forma legal de exigir la retirada.',
  },

  // ─── Non-compete ─────────────────────────────────────────────────────
  {
    slug: 'overly-broad-non-compete',
    category: 'noncompete',
    title: 'No Competencia Excesivamente Amplia',
    searchTerm: 'cláusula no competencia freelance contrato',
    metaDescription:
      '"Ningún sector similar por 2 años" puede arrasar todo tu mercado. Aquí cómo negociar una no-competencia razonable y exigible.',
    example: '"El contratista acuerda no proporcionar servicios a ninguna empresa de un sector similar por 2 años."',
    danger:
      'Si eres diseñador web para un restaurante, esto podría impedirte trabajar con cualquier restaurante por 2 años, eliminando una buena parte de tu mercado. Muchas no-competencias excesivamente amplias no son exigibles en los tribunales, pero igualmente tendrías que pagar honorarios legales para defenderte, y la mayoría de los freelancers no pueden permitírselo. Mejor no firmar nunca una.',
    fix: 'Limita el alcance drásticamente, tanto en duración como en definición de competidor: "El contratista acuerda no solicitar directamente a los clientes existentes nombrados del cliente, o proporcionar el mismo servicio específico a [competidor directo nombrado, p. ej., los 3 principales competidores listados de Acme Corp] por 6 meses tras la finalización del proyecto." Específica, con plazo limitado, y restringida.',
    realScenario:
      'Un freelancer de marketing firma una no-competencia que le impide trabajar con "cualquier empresa de e-commerce" por 18 meses. Se especializa en e-commerce. La cláusula liquida su pipeline, y pasa un año trabajando en sectores adyacentes que no disfruta.',
  },
  {
    slug: 'implied-exclusivity',
    category: 'noncompete',
    title: 'Exclusividad Implícita',
    searchTerm: 'exclusividad implícita contrato freelance atención total',
    metaDescription:
      '"Atención total" suena inofensivo pero es una cláusula encubierta de exclusividad que se puede usar contra ti. Aquí el lenguaje a usar en su lugar.',
    example: '"El contratista dedicará atención y recursos totales a los proyectos del cliente."',
    danger:
      '"Atención total" suena como una cláusula de exclusividad ante un abogado. El cliente puede argumentar luego que violaste el contrato al aceptar otro trabajo, incluso si tus otros clientes no tenían nada que ver con los suyos. Algunos clientes usan deliberadamente este lenguaje para encerrarte en una exclusividad de hecho sin pagarla.',
    fix: '"El contratista dedicará un esfuerzo profesional razonable para completar los entregables en los plazos acordados. El contratista puede aceptar otros clientes simultáneamente, siempre que otros compromisos no comprometan el calendario de entrega acordado. El contratista es un contratista independiente, no un empleado, y no está sujeto a obligaciones de servicio exclusivo."',
    realScenario:
      'Un consultor acepta un compromiso de 3 meses con lenguaje de "atención total." A mitad del proyecto, el cliente descubre que el consultor tiene otro cliente y amenaza con demandarlo por incumplimiento de contrato. El consultor o bien deja al otro cliente (perdiendo ingresos) o pelea una demanda que probablemente gana pero no puede costear.',
  },

  // ─── Payment ───────────────────────────────────────────────────────────
  {
    slug: 'net-60-payment-terms',
    category: 'payment',
    title: 'Términos de Pago Net-60 o Más Largos',
    searchTerm: 'pago net 60 contrato freelance',
    metaDescription:
      'Net-60 significa que financias el negocio del cliente durante 2 meses por cada factura. Aquí por qué destruye tu flujo de caja y cómo negociar plazos más cortos.',
    example: '"Las facturas vencen Net-60 desde la fecha de recepción."',
    danger:
      'Estás financiando el negocio del cliente durante 2 meses por cada factura. A escala, esto destruye tu flujo de caja, y los clientes que pagan tarde siempre van a apurar el límite. Una factura Net-60 del 1 de junio ni siquiera está técnicamente vencida hasta el 1 de agosto, y la mayoría de los clientes corporativos añaden otras 2 semanas de "tiempo de procesamiento" encima. Puedes estar haciendo el trabajo y esperando 90+ días para cobrar.',
    fix: 'Negocia Net-14 o Net-30 como máximo. Añade intereses por mora con dientes: "Las facturas no pagadas 30 días después de la fecha de vencimiento acumularán un interés mensual del 1.5%, más costos de cobro y honorarios legales razonables si la cobranza se vuelve necesaria." Exige el 50% por adelantado en proyectos sobre $X. Para compromisos continuos, factura semanal o quincenalmente en vez de mensualmente.',
    realScenario:
      'Una agencia de desarrollo gana un cliente "increíble" Fortune 500 con términos Net-60. Para el mes 3 ya han completado $40K de trabajo pero recibido $0. Para el mes 5 todavía están "en la cola de cuentas por pagar." La agencia tiene que tomar una línea de crédito para pagar la nómina mientras esperan un cobro garantizado.',
  },
  {
    slug: 'payment-tied-to-third-party',
    category: 'payment',
    title: 'Pago Atado a Aprobación de Terceros',
    searchTerm: 'pago contingente aprobación gerencial contrato',
    metaDescription:
      'Pago "sujeto a aprobación gerencial" o "tras cerrar la ronda de financiación" te hace cargar con el riesgo de las decisiones de otros. Aquí cómo eliminar eso.',
    example: '"El pago está condicionado a la aprobación de la gerencia del cliente / al cierre de la ronda de financiación."',
    danger:
      'No tienes ningún control sobre si su gerente aprueba o si cierra su ronda de financiación. Tú ya hiciste el trabajo. Las rondas de financiación se retrasan todo el tiempo. Los gerentes se van. La política interna cambia de la noche a la mañana. Ninguna de esas cosas debería afectar si te pagan por trabajo que ya terminaste. Esta cláusula transfiere el riesgo de negocio del cliente hacia ti.',
    fix: 'Elimina por completo el lenguaje condicional. Ata el pago a tu entrega, no a sus procesos internos: "El pago vence 14 días desde la fecha de la factura. Las aprobaciones internas, eventos de financiación o retrasos de procesamiento de terceros no extienden la fecha de vencimiento del pago." Si insisten, pide un depósito por adelantado en su lugar.',
    realScenario:
      'Un diseñador firma un trato "condicionado a la Serie A" con una startup, apostando a que la ronda cerrará. No cierra. La startup pivota, el proyecto se archiva, y al diseñador le deben $18K sin derecho contractual a cobrar: aceptó explícitamente que el pago era condicional.',
  },
  {
    slug: 'no-kill-fee',
    category: 'payment',
    title: 'Sin Tarifa de Cancelación',
    searchTerm: 'kill fee tarifa cancelación contrato freelance',
    metaDescription:
      'Si un cliente cancela a mitad de proyecto y tu contrato no tiene tarifa de cancelación, puedes perder meses de ingresos previstos. Aquí el lenguaje a añadir.',
    example: '(Ausencia de cualquier cláusula de terminación o compensación por cancelación)',
    danger:
      'Si el proyecto se cancela a mitad de camino, no recibes nada por el trabajo completado a menos que ya lo hayas facturado. Los proyectos se cancelan todo el tiempo, muchas veces justo después de hacer la parte más difícil (investigación, estrategia, primeros borradores) pero antes de la entrega final. Sin una tarifa de cancelación, el cliente se queda con el trabajo en etapa temprana por lo que ya pagó, y tú comes el resto.',
    fix: '"Si el cliente termina el proyecto por cualquier motivo, todo el trabajo completado a la fecha se factura a la tarifa acordada y vence inmediatamente. Aplica una tarifa de cancelación equivalente al 25% del valor restante del contrato, pagadera dentro de los 14 días del aviso de terminación. Cualquier depósito pagado es no reembolsable." Para proyectos por fases, considera depósitos de fase no reembolsables.',
    realScenario:
      'Una diseñadora de marca está al 60% de un rebranding de $20K cuando el cliente es adquirido y el proyecto se cancela. Sin tarifa de cancelación, ya facturó $8K, y le deben $12K de ingresos previstos sin reclamo contractual. La empresa adquirente nunca retoma el proyecto.',
  },

  // ─── Liability ─────────────────────────────────────────────────────────
  {
    slug: 'unlimited-liability',
    category: 'liability',
    title: 'Responsabilidad Ilimitada',
    searchTerm: 'cláusula responsabilidad ilimitada contratista',
    metaDescription:
      '"Responsable por todos los daños" es abierto y peligroso: un pequeño bug podría exponerte a reclamos a escala empresarial. Aquí el límite de responsabilidad estándar.',
    example: '"El contratista será responsable por todos los daños derivados de este acuerdo."',
    danger:
      '"Todos los daños" puede incluir daños consecuenciales, indirectos y punitivos. Un bug en una landing page podría teóricamente exponerte a la responsabilidad por todos los ingresos perdidos del cliente. Un error tipográfico en el copy podría enmarcarse como causante de un lanzamiento fallido. La exposición monetaria no tiene tope, así que un solo proyecto podría llevarte a la quiebra si algo sale mal.',
    fix: '"La responsabilidad acumulada total del contratista bajo este acuerdo, independientemente de la forma de la acción, no excederá los honorarios pagados al contratista en los 3 meses inmediatamente anteriores al reclamo. Ninguna parte será responsable por daños indirectos, consecuenciales, especiales, incidentales o punitivos, incluyendo lucro cesante o pérdida de datos, incluso si fue advertida de la posibilidad de tales daños."',
    realScenario:
      'Un desarrollador lanza una página de checkout con un bug que falla intermitentemente en Safari. El cliente reclama $200K por "ventas perdidas durante la ventana del bug" y exige que el desarrollador lo cubra. Con responsabilidad ilimitada, el desarrollador no tiene un tope contractual al que apuntar y enfrenta una amenaza legal real, incluso si el bug genuinamente no fue su culpa.',
  },
  {
    slug: 'one-way-indemnification',
    category: 'liability',
    title: 'Indemnización Unilateral',
    searchTerm: 'indemnización unilateral contrato freelance',
    metaDescription:
      'Si tú indemnizas al cliente pero ellos no te indemnizan a ti, estás pagando sus facturas legales por cosas fuera de tu control. Hazla mutua.',
    example: '"El contratista deberá indemnizar, defender y eximir al cliente de cualquier reclamo derivado del trabajo del contratista."',
    danger:
      'Si la indemnización solo fluye en una dirección (contratista → cliente), estás cubriendo los costos legales del cliente incluso cuando el reclamo no tiene nada que ver con tu trabajo. Un tercero demanda al cliente por cómo el cliente usó tus entregables, y tú pagas los abogados. La indemnización unilateral es una bandera roja importante en cualquier contrato.',
    fix: 'Exige indemnización mutua, donde cada parte indemniza a la otra por sus propios actos, con salvedades por negligencia grave o conducta dolosa del indemnizante. "Cada parte deberá indemnizar, defender y eximir a la otra de reclamos de terceros que surjan únicamente de la negligencia grave, conducta dolosa o incumplimiento material de este acuerdo por parte de la parte indemnizante. Ninguna parte será responsable por los actos u omisiones de la otra."',
    realScenario:
      'El cliente de un consultor es demandado por un competidor por una campaña de marketing. La campaña usó un posicionamiento de mercado que decidió el cliente. Bajo una indemnización unilateral, el consultor está obligado a cubrir la defensa legal del cliente, aunque no tuvo papel alguno en la decisión estratégica cuestionada.',
  },
  {
    slug: 'ip-indemnification-without-boundaries',
    category: 'liability',
    title: 'Indemnización de PI sin Límites',
    searchTerm: 'indemnización propiedad intelectual freelance materiales cliente',
    metaDescription:
      'Garantizar que "los entregables no infringen PI" te hace responsable también por materiales aportados por el cliente. Aquí cómo limitar la garantía a tu propio trabajo.',
    example: '"El contratista garantiza que los entregables no infringen ningún derecho de propiedad intelectual de terceros."',
    danger:
      'No puedes controlar lo que aporta el cliente: logos, imágenes de stock, copy, fuentes, activos de terceros que dicen tener licenciados. Si los materiales aportados por el cliente infringen, igualmente puedes quedar atrapado porque la garantía cubre "los entregables" sin distinguir qué vino de ti vs. qué vino de ellos. Aunque protestes después, ya firmaste la garantía.',
    fix: '"El contratista garantiza que los elementos originales creados por el contratista no infringen, según su conocimiento, derechos de PI de terceros. El cliente declara y garantiza que todos los materiales proporcionados al contratista (incluyendo, sin limitación, logos, imágenes, fuentes, copy y activos de terceros) son propiedad del cliente o están debidamente licenciados para el uso previsto, y el cliente indemnizará al contratista por cualquier reclamo de infracción relacionado con materiales aportados por el cliente."',
    realScenario:
      'Una diseñadora web integra una fuente que proporcionó el cliente. El cliente en realidad no tenía la licencia comercial. La fundición de tipos envía una carta de infracción de seis cifras, y bajo la garantía original, la diseñadora es nombrada co-demandada. Sin la salvedad, comparte los costos legales.',
  },

  // ─── Termination ───────────────────────────────────────────────────────
  {
    slug: 'termination-for-convenience-no-compensation',
    category: 'termination',
    title: 'Terminación por Conveniencia sin Compensación',
    searchTerm: 'terminación por conveniencia contrato freelance',
    metaDescription:
      'Una cláusula de terminación con "7 días de aviso por escrito" sin tarifa de cancelación permite que el cliente se vaya días antes del lanzamiento sin pagar nada extra. Aquí el lenguaje más seguro.',
    example: '"Cualquiera de las partes puede terminar este acuerdo con 7 días de aviso por escrito."',
    danger:
      'El cliente puede irse 7 días antes del lanzamiento, después de que hiciste el 95% del trabajo, y legalmente no debe nada más allá de lo facturado. Esta cláusula se abusa con más frecuencia en el peor momento posible: justo cuando su campeón interno se va, o el presupuesto se recorta, o un competidor ofrece más barato. La ventana de 7 días le da al cliente una opción gratuita de cancelar, pagada por ti.',
    fix: 'Ata la terminación por conveniencia a una tarifa de cancelación más el pago por todo el trabajo completado: "La terminación por conveniencia requiere (a) pago por todo el trabajo completado a la fecha, calculado a la tarifa por hora del contratista o tarifa pro-rata del proyecto; (b) una tarifa de cancelación equivalente al 20% del valor no pagado del contrato; y (c) 14 días de aviso por escrito. La terminación por causa requiere 30 días de aviso y oportunidad de subsanar."',
    realScenario:
      'Un desarrollador está al 80% de un proyecto de $30K. El nuevo VP del cliente quiere "reevaluar a los proveedores" y termina con 7 días de aviso. El contrato del desarrollador dice que solo le pagan por trabajo facturado. Ha facturado $15K de los $30K, así que se va con $15K menos sin recurso: meses de trabajo bloqueando su pipeline por la mitad del pago acordado.',
  },
  {
    slug: 'indefinite-pause-clause',
    category: 'termination',
    title: 'Derecho del Cliente a Pausar Indefinidamente',
    searchTerm: 'cláusula pausa proyecto contrato freelance',
    metaDescription:
      'Una cláusula de pausa-cuando-quiera permite que el cliente congele tu proyecto por meses mientras tú no puedes aceptar otro trabajo. Aquí cómo limitar las pausas en el tiempo.',
    example: '"El cliente puede pausar el proyecto en cualquier momento mediante aviso por escrito."',
    danger:
      'Has bloqueado a este cliente en tu agenda. Una "pausa" que dura 6 meses significa que no puedes aceptar otro trabajo y no estás cobrando. Peor aún, cuando el cliente reanuda, espera que dejes todo y retomes, lo que significa que no puedes comprometerte con otros clientes mientras tanto. Las cláusulas de pausa son, de facto, opciones gratuitas e ilimitadas sobre tu tiempo.',
    fix: '"El proyecto puede pausarse hasta 30 días con aviso por escrito. Las pausas que excedan los 30 días se tratarán como terminaciones y activarán la cláusula de tarifa de cancelación. El re-compromiso después de la terminación requiere un nuevo SOW y un nuevo depósito. La tarifa por hora del contratista podrá ajustarse para cualquier nuevo SOW."',
    realScenario:
      'El cliente de un consultor pausa un compromiso de $50K "por unas semanas" mientras se reestructura. Cinco meses después finalmente vuelven a contactar para reanudar. El consultor ha tenido que rechazar trabajo todo ese tiempo, y luego tiene que dar prioridad inmediata al proyecto reanudado. Efecto neto: 5 meses de ingresos perdidos más una entrega apresurada.',
  },
];

export function getClauseEs(slug) {
  return clausesEs.find(c => c.slug === slug);
}

export function getRelatedClausesEs(slug, limit = 3) {
  const current = getClauseEs(slug);
  if (!current) return [];
  const sameCategory = clausesEs.filter(c => c.category === current.category && c.slug !== slug);
  const otherCategory = clausesEs.filter(c => c.category !== current.category);
  return [...sameCategory, ...otherCategory].slice(0, limit);
}

export function getCategoryNameEs(id) {
  return clauseCategoriesEs.find(c => c.id === id)?.name || '';
}
