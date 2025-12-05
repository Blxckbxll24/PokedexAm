import { describe, it, expect } from 'vitest'

/**
 * ARCHIVO PARA DEMOSTRACIÓN DE FALLO INTENCIONAL
 * 
 * Este archivo contiene tests que pueden descomentarse para demostrar
 * fallos en el pipeline durante la evaluación DevOps.
 * 
 * INSTRUCCIONES:
 * 1. Para Paso 1 (Fallo Intencional): Descomentar los tests de abajo
 * 2. Para Paso 2 (Éxito en Develop): Comentar nuevamente los tests
 */

describe('Demo Failure Tests', () => {
  // ========================================
  // DESCOMENTAR PARA DEMOSTRAR FALLO
  // ========================================
  /*
  it('should fail intentionally - math error', () => {
    // Este test fallará para demostrar Quality Gate
    expect(2 + 2).toBe(5)
  })

  it('should fail intentionally - string error', () => {
    // Otro test que falla
    expect('hello').toBe('world')
  })

  it('should fail intentionally - array error', () => {
    // Test que falla con arrays
    expect([1, 2, 3]).toEqual([1, 2, 4])
  })
  */

  // ========================================
  // TEST QUE SIEMPRE PASA (para verificar que el archivo funciona)
  // ========================================
  it('should always pass - sanity check', () => {
    expect(true).toBe(true)
    expect(1 + 1).toBe(2)
    expect('test').toBe('test')
  })
})

/**
 * CÓDIGO CON CODE SMELLS INTENCIONADOS
 * (Para que SonarQube detecte problemas de calidad)
 */

// Función duplicada intencionalmente
function duplicatedFunction() {
  const a = 1
  const b = 2
  const c = 3
  const d = 4
  const e = 5
  return a + b + c + d + e
}

// Misma función duplicada para generar code smells
function anotherDuplicatedFunction() {
  const a = 1
  const b = 2
  const c = 3
  const d = 4
  const e = 5
  return a + b + c + d + e
}

// Función con complejidad ciclomática alta
function complexFunction(x: number): string {
  if (x > 100) {
    if (x > 200) {
      if (x > 300) {
        if (x > 400) {
          if (x > 500) {
            return 'muy muy alto'
          }
          return 'muy alto'
        }
        return 'alto'
      }
      return 'medio alto'
    }
    return 'medio'
  } else {
    if (x > 50) {
      if (x > 75) {
        return 'medio bajo'
      }
      return 'bajo'
    }
    return 'muy bajo'
  }
}

// Variables no utilizadas (code smells) - COMENTADAS por defecto
// const unusedVariable = 'this will cause code smell'
// const anotherUnusedVariable = 123

export { duplicatedFunction, anotherDuplicatedFunction, complexFunction }