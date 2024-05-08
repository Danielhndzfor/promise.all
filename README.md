# Cómo obtener datos en React con rendimiento

## Tipos de obtención de datos:

- **Inicial:** Datos que se muestran inmediatamente al abrir una página.
- **A pedido:** Datos que se obtienen cuando el usuario interactúa con la página.

## ¿Se necesita una biblioteca externa?

No es necesario para obtener datos simples.
Las bibliotecas como axios y swr pueden simplificar la obtención de datos complejos (manejo de errores, almacenamiento en caché).

## Consejos de rendimiento:

- Considera mostrar contenido gradualmente para mejorar la experiencia del usuario.
- Utiliza bibliotecas para manejar operaciones complejas de obtención de datos.

## Estrategias de rendimiento:

Existen tres estrategias principales para mostrar datos:

1. **Mostrar todo a la vez:** Mostrar todos los datos una vez que se hayan cargado. Esto puede tardar más, pero proporciona una experiencia más completa.
2. **Mostrar datos progresivamente:** Mostrar partes de los datos a medida que se cargan. Esto proporciona una experiencia más rápida, pero puede ser menos inmersiva.
3. **Priorizar el contenido:** Mostrar los datos más importantes primero y luego cargar el resto gradualmente. Esto equilibra la velocidad y la inmersión.

La mejor estrategia depende de la aplicación y la experiencia de usuario deseada.

## Ciclo de vida de React y obtención de datos

El ciclo de vida de los componentes de React es crucial para planificar la estrategia de obtención de datos.

### ¿Cuándo se activa useEffect?

- useEffect solo se activa cuando el componente se monta o cuando sus dependencias cambian.
- Si un componente hijo se renderiza condicionalmente, useEffect no se activará hasta que la condición se cumpla.

### ¿Cuándo se renderiza un componente?

- Un componente se renderiza cuando se devuelve desde su función de renderizado.
- El simple hecho de declarar un componente (por ejemplo, const child = <Child />) no lo renderiza.

## Limitaciones del navegador y obtención de datos

Los navegadores tienen un límite en el número de solicitudes paralelas que pueden realizar al mismo host. En Chrome, este límite es de solo 6 solicitudes.

Si se realizan más solicitudes al mismo tiempo, las solicitudes restantes tendrán que hacer cola y esperar a que haya un "espacio" disponible.

Esto puede ser un problema en aplicaciones grandes que realizan muchas solicitudes de obtención de datos. Por ejemplo, una aplicación de seguimiento de incidencias simple puede realizar 3 solicitudes solo para la obtención de datos inicial.

Si se añade una solicitud de análisis lenta al principio de la aplicación, puede ralentizar toda la experiencia, incluso si la solicitud de análisis es rápida por sí misma.

Por ejemplo, si se añaden 6 solicitudes que tardan 10 segundos antes de una solicitud de análisis rápida, la carga de toda la aplicación tardará 10 segundos.

## Cascadas de solicitudes: cómo aparecen

Para implementar la obtención de datos en nuestra aplicación de seguimiento de incidencias, podemos utilizar el siguiente enfoque:

- Crear un hook personalizado (useData) para gestionar la obtención de datos y el estado.
- Utilizar el hook en los componentes Comentarios e Incidencia para obtener los datos necesarios.
- Mostrar un estado de carga mientras se esperan los datos.
- Renderizar los componentes Comentarios e Incidencia una vez que se disponga de los datos.

Este enfoque implementa una cascada de solicitudes clásica, en la que cada componente desencadena la obtención de datos cuando se monta. Sin embargo, este enfoque puede provocar un rendimiento lento si hay muchas solicitudes de obtención de datos.

## Promise.all

Para resolver la cascada de solicitudes, podemos utilizar la función Promise.all para ejecutar todas las solicitudes de obtención de datos en paralelo. Esto garantiza que los datos estén disponibles lo antes posible, reduciendo el tiempo de espera.

Para utilizar Promise.all, podemos crear un hook personalizado que ejecute todas las solicitudes de obtención de datos en paralelo y almacene los resultados en el estado. Luego, podemos pasar los datos del estado a los componentes secundarios como accesorios.

Este enfoque mejora significativamente el rendimiento al reducir el tiempo de espera a la solicitud más larga en lugar de la suma de todos los tiempos de espera.

## Soluciones de promesas paralelas

Para ejecutar las solicitudes de obtención de datos en paralelo pero esperar los resultados de forma independiente, podemos utilizar promesas tradicionales en lugar de async/await. Esto nos permite renderizar los componentes tan pronto como sus datos estén disponibles, sin esperar a que se resuelvan todas las solicitudes.

Este enfoque mejora el rendimiento al reducir el tiempo de espera a la solicitud más larga, al igual que el enfoque Promise.all. Sin embargo, es importante tener en cuenta que puede provocar múltiples actualizaciones de estado y, por lo tanto, múltiples representaciones del componente principal. Esto puede afectar al rendimiento si los componentes afectados son grandes o están ubicados en la parte superior de la jerarquía de componentes.

## Proveedores de datos para abstraer la obtención de datos

Introducir el concepto de "proveedores de datos" en una aplicación React puede mejorar la arquitectura y la legibilidad del código. Los proveedores de datos actúan como una capa de almacenamiento en caché para las solicitudes de obtención de datos, lo que permite obtener datos desde un único lugar de la aplicación y acceder a ellos desde cualquier otro lugar, evitando la necesidad de pasar datos a través de varios componentes.

En React, los proveedores de datos se pueden implementar utilizando contextos. Cada proveedor de datos envuelve un componente y activa las solicitudes de obtención de datos en paralelo tan pronto como se monta. Los componentes pueden acceder a los datos proporcionados mediante el uso de ganchos personalizados.

El uso de proveedores de datos reduce la perforación de accesorios y simplifica la estructura de la aplicación, lo que resulta en un código más limpio y mantenible.

## Conclusión

Para obtener datos en React de forma eficiente, utiliza las siguientes estrategias:

- Considera el tipo de datos y utiliza bibliotecas para simplificar la obtención de datos complejos.
- Muestra el contenido gradualmente y prioriza los datos importantes.
- Comprende el ciclo de vida de los componentes y las limitaciones del navegador.

Para evitar las cascadas de solicitudes, puedes utilizar:

- Promise.all: Espera a que se obtengan todos los datos antes de mostrarlos (tiempo de espera más largo).
- Promesas paralelas: Muestra los datos tan pronto como estén disponibles (puede provocar múltiples actualizaciones de estado).

La mejor solución depende de tus necesidades específicas.

Además, utiliza proveedores de datos para:

- Almacenar en caché las solicitudes de obtención de datos.
- Obtener datos desde un único lugar.
- Simplificar la estructura de la aplicación.

Combinando estas estrategias, puedes optimizar la obtención de datos en tus aplicaciones React, mejorar el rendimiento y crear un código más limpio y fácil de mantener.