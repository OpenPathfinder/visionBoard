const { internalLinkBuilder } = require('../src/reports')

describe('internalLinkBuilder', () => {
  describe('static mode', () => {
    const staticLinkBuilder = internalLinkBuilder('static')

    test('should handle empty reference', () => {
      expect(staticLinkBuilder('', null)).toBe('index.html')
    })

    test('should remove leading slash in static mode', () => {
      expect(staticLinkBuilder('/assets/favicon.ico', null)).toBe('assets/favicon.ico')
    })

    test('should handle project references in static mode', () => {
      const project = { name: 'testproject', id: 123 }
      expect(staticLinkBuilder('', project)).toBe('testproject.html')
    })

    test('should prioritize project reference over path', () => {
      const project = { name: 'testproject', id: 123 }
      expect(staticLinkBuilder('/some/path', project)).toBe('testproject.html')
    })
  })

  describe('server mode', () => {
    const serverLinkBuilder = internalLinkBuilder('server')

    test('should handle empty reference', () => {
      expect(serverLinkBuilder('', null)).toBe('index.html')
    })

    test('should preserve leading slash in server mode', () => {
      expect(serverLinkBuilder('/assets/favicon.ico', null)).toBe('/assets/favicon.ico')
    })

    test('should handle project references in server mode', () => {
      const project = { name: 'testproject', id: 123 }
      expect(serverLinkBuilder('', project)).toBe('/projects/123')
    })

    test('should prioritize project reference over path', () => {
      const project = { name: 'testproject', id: 123 }
      expect(serverLinkBuilder('/some/path', project)).toBe('/projects/123')
    })
  })
})
