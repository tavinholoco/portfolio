/**
 * Título e descrição de seção, o par que se repetia em três componentes.
 *
 * Voltou a existir depois que o `<SectionHeading>` da v3 foi deletado na §12.5.
 * A diferença é o escopo: aquele carregava rótulo, título, descrição e
 * alinhamento, e morreu quando seus dois consumidores perderam o cabeçalho.
 * Este é só o par que sobrou copiado, e por isso não tem prop de layout.
 *
 * **Unifica uma divergência que já existia:** `career` pintava a descrição com
 * `text-muted-foreground` enquanto `process` e `skills` usavam `opacity-70`. A
 * lei 6 do projeto pede hierarquia por opacidade, e cor que não herda ainda
 * inverte sozinha se a seção um dia virar `blend`. Ficou `opacity-70` nos três.
 *
 * Não serve para `<About>` nem para a página de case: lá o título é `h1` e a
 * escala é outra. Forçar os cinco no mesmo componente foi exatamente o que
 * inchou o `<SectionHeading>` até ele não servir para ninguém.
 */
export function SectionIntro({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  /*
   * A entrada suave saiu daqui e subiu para o container do <Section>, que
   * cobre a seção inteira. Repetir o `animate-fade-in` aqui dentro não
   * adiantaria nada e ainda atrapalharia: duas opacidades aninhadas se
   * multiplicam, então o intro chegaria ao fim do fade mais apagado que o
   * resto do conteúdo, que é justamente o descompasso que este passe corrige.
   */
  return (
    <div className={className}>
      <h2 className="text-title font-semibold tracking-tight text-balance">
        {title}
      </h2>
      {description && (
        <p className="font-body mt-6 max-w-2xl text-base leading-relaxed opacity-70 text-pretty">
          {description}
        </p>
      )}
    </div>
  );
}
