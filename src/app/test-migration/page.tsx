'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function MigrateProfileCarsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const runMigration = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/garage/migrate-profile-cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ 
        success: false, 
        error: 'Erro ao executar migração',
        details: error instanceof Error ? error.message : 'Erro desconhecido' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-charcoal to-graphite py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <Card className="bg-charcoal/80 border-steel/30 backdrop-blur-sm">
          <CardHeader className="border-b border-steel/20">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-racing-red/20 rounded-lg flex items-center justify-center">
                🔄
              </div>
              Migração de Carros - Perfil para Garagem
            </CardTitle>
            <p className="text-steel text-sm">
              Esta ferramenta migra os carros cadastrados no perfil dos usuários para a tabela de veículos da garagem.
            </p>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="bg-racing-red/10 border border-racing-red/30 rounded-lg p-4">
              <h3 className="text-racing-red font-semibold mb-2">⚠️ Importante</h3>
              <p className="text-steel text-sm">
                Esta migração corrige o problema onde carros cadastrados durante o aceite do convite 
                não aparecem na garagem do usuário.
              </p>
            </div>

            <Button
              onClick={runMigration}
              disabled={loading}
              className="w-full bg-racing-red hover:bg-racing-red/80 text-white font-semibold py-3"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Executando migração...
                </div>
              ) : (
                'Executar Migração'
              )}
            </Button>

            {result && (
              <Card className={`${result.success ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                    {result.success ? '✅ Sucesso' : '❌ Erro'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white mb-3">{result.message || result.error}</p>
                  
                  {result.details && (
                    <div className="space-y-2">
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className="text-green-400 border-green-500/30">
                          Migrados: {result.details.migrated || 0}
                        </Badge>
                        <Badge variant="outline" className="text-yellow-400 border-yellow-500/30">
                          Já existiam: {result.details.skipped || 0}
                        </Badge>
                        <Badge variant="outline" className="text-blue-400 border-blue-500/30">
                          Total processados: {result.details.total || 0}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {typeof result.details === 'string' && (
                    <pre className="bg-black/50 p-3 rounded text-sm text-steel overflow-x-auto mt-3">
                      {result.details}
                    </pre>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="text-center pt-4">
              <p className="text-steel text-sm">
                Após executar a migração, verifique a garagem para ver se os carros apareceram.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
