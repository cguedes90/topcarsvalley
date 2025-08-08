'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Settings,
  Mail,
  Database,
  Shield,
  Palette,
  Bell,
  ArrowLeft,
  Save,
  RotateCcw,
  Key,
  Server,
  Globe,
  Users,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface SystemSettings {
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  general: {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    inviteOnlyMode: boolean;
    maxMembersPerEvent: number;
  };
  features: {
    garageFunctionEnabled: boolean;
    communityFunctionEnabled: boolean;
    eventRSVPEnabled: boolean;
    contactFormEnabled: boolean;
    partnershipEnabled: boolean;
  };
  security: {
    passwordMinLength: number;
    sessionTimeout: number;
    maxLoginAttempts: number;
    requireEmailVerification: boolean;
  };
}

const AdminSettingsPage = () => {
  const router = useRouter();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (!token || userData.role !== 'ADMIN') {
      router.push('/login');
      return;
    }
    
    fetchSettings();
  }, [router]);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        setHasChanges(false);
        // Show success message
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (path: string, value: any) => {
    if (!settings) return;
    
    const keys = path.split('.');
    const newSettings = { ...settings };
    let current: any = newSettings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setSettings(newSettings);
    setHasChanges(true);
  };

  const tabs = [
    { id: 'general', label: 'Geral', icon: Globe },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'features', label: 'Funcionalidades', icon: Zap },
    { id: 'security', label: 'Segurança', icon: Shield },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando configurações...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-charcoal border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push('/admin')}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-orbitron font-bold text-white">
                  Configurações do Sistema
                </h1>
                <p className="text-gray-300 mt-1">
                  Gerencie configurações globais da plataforma
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {hasChanges && (
                <div className="flex items-center text-yellow-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Alterações não salvas
                </div>
              )}
              <Button
                onClick={fetchSettings}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Recarregar
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className="bg-racing-red hover:bg-red-700"
              >
                {saving ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-racing-red text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">
            {!settings ? (
              <div className="bg-charcoal rounded-lg p-8 text-center">
                <Settings className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  Erro ao carregar configurações
                </h3>
                <p className="text-gray-500 mb-6">
                  Não foi possível carregar as configurações do sistema.
                </p>
                <Button
                  onClick={fetchSettings}
                  className="bg-racing-red hover:bg-red-700"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
              </div>
            ) : (
              <div className="bg-charcoal rounded-lg p-8">
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Globe className="h-5 w-5 mr-2" />
                        Configurações Gerais
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nome do Site
                        </label>
                        <input
                          type="text"
                          value={settings.general.siteName}
                          onChange={(e) => updateSettings('general.siteName', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Máx. Membros por Evento
                        </label>
                        <input
                          type="number"
                          value={settings.general.maxMembersPerEvent}
                          onChange={(e) => updateSettings('general.maxMembersPerEvent', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Descrição do Site
                      </label>
                      <textarea
                        value={settings.general.siteDescription}
                        onChange={(e) => updateSettings('general.siteDescription', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-300">
                            Modo de Manutenção
                          </label>
                          <p className="text-xs text-gray-500">
                            Desabilita o acesso público ao site
                          </p>
                        </div>
                        <button
                          onClick={() => updateSettings('general.maintenanceMode', !settings.general.maintenanceMode)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.general.maintenanceMode ? 'bg-racing-red' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.general.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-300">
                            Registro Habilitado
                          </label>
                          <p className="text-xs text-gray-500">
                            Permite novos registros na plataforma
                          </p>
                        </div>
                        <button
                          onClick={() => updateSettings('general.registrationEnabled', !settings.general.registrationEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.general.registrationEnabled ? 'bg-green-500' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.general.registrationEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-300">
                            Modo Apenas Convites
                          </label>
                          <p className="text-xs text-gray-500">
                            Registros apenas por convite
                          </p>
                        </div>
                        <button
                          onClick={() => updateSettings('general.inviteOnlyMode', !settings.general.inviteOnlyMode)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.general.inviteOnlyMode ? 'bg-yellow-500' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.general.inviteOnlyMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Settings */}
                {activeTab === 'email' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Mail className="h-5 w-5 mr-2" />
                        Configurações de Email
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Servidor SMTP
                        </label>
                        <input
                          type="text"
                          value={settings.email.smtpHost}
                          onChange={(e) => updateSettings('email.smtpHost', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Porta SMTP
                        </label>
                        <input
                          type="number"
                          value={settings.email.smtpPort}
                          onChange={(e) => updateSettings('email.smtpPort', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Usuário SMTP
                        </label>
                        <input
                          type="email"
                          value={settings.email.smtpUser}
                          onChange={(e) => updateSettings('email.smtpUser', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Senha SMTP
                        </label>
                        <input
                          type="password"
                          value={settings.email.smtpPassword}
                          onChange={(e) => updateSettings('email.smtpPassword', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email de Envio
                        </label>
                        <input
                          type="email"
                          value={settings.email.fromEmail}
                          onChange={(e) => updateSettings('email.fromEmail', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nome do Remetente
                        </label>
                        <input
                          type="text"
                          value={settings.email.fromName}
                          onChange={(e) => updateSettings('email.fromName', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Features Settings */}
                {activeTab === 'features' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Zap className="h-5 w-5 mr-2" />
                        Funcionalidades da Plataforma
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-300">
                            Função Garagem
                          </label>
                          <p className="text-xs text-gray-500">
                            Permite membros cadastrarem seus veículos
                          </p>
                        </div>
                        <button
                          onClick={() => updateSettings('features.garageFunctionEnabled', !settings.features.garageFunctionEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.features.garageFunctionEnabled ? 'bg-green-500' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.features.garageFunctionEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-300">
                            Função Comunidade
                          </label>
                          <p className="text-xs text-gray-500">
                            Permite interação entre membros
                          </p>
                        </div>
                        <button
                          onClick={() => updateSettings('features.communityFunctionEnabled', !settings.features.communityFunctionEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.features.communityFunctionEnabled ? 'bg-green-500' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.features.communityFunctionEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-300">
                            RSVP de Eventos
                          </label>
                          <p className="text-xs text-gray-500">
                            Permite confirmação de presença em eventos
                          </p>
                        </div>
                        <button
                          onClick={() => updateSettings('features.eventRSVPEnabled', !settings.features.eventRSVPEnabled)}
                          className={`relative inline-flex h-6 w-11 items-centers rounded-full transition-colors ${
                            settings.features.eventRSVPEnabled ? 'bg-green-500' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.features.eventRSVPEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-300">
                            Formulário de Contato
                          </label>
                          <p className="text-xs text-gray-500">
                            Habilita formulário de contato público
                          </p>
                        </div>
                        <button
                          onClick={() => updateSettings('features.contactFormEnabled', !settings.features.contactFormEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.features.contactFormEnabled ? 'bg-green-500' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.features.contactFormEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-300">
                            Sistema de Parcerias
                          </label>
                          <p className="text-xs text-gray-500">
                            Exibe parceiros oficiais na plataforma
                          </p>
                        </div>
                        <button
                          onClick={() => updateSettings('features.partnershipEnabled', !settings.features.partnershipEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.features.partnershipEnabled ? 'bg-green-500' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.features.partnershipEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Configurações de Segurança
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Comprimento Mínimo da Senha
                        </label>
                        <input
                          type="number"
                          min="6"
                          max="32"
                          value={settings.security.passwordMinLength}
                          onChange={(e) => updateSettings('security.passwordMinLength', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Timeout de Sessão (horas)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="168"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => updateSettings('security.sessionTimeout', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Máx. Tentativas de Login
                        </label>
                        <input
                          type="number"
                          min="3"
                          max="10"
                          value={settings.security.maxLoginAttempts}
                          onChange={(e) => updateSettings('security.maxLoginAttempts', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-300">
                            Verificação de Email Obrigatória
                          </label>
                          <p className="text-xs text-gray-500">
                            Exige verificação de email para novos usuários
                          </p>
                        </div>
                        <button
                          onClick={() => updateSettings('security.requireEmailVerification', !settings.security.requireEmailVerification)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.security.requireEmailVerification ? 'bg-green-500' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.security.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
