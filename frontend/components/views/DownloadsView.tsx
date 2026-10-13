import React, { useState } from 'react';
import {
  FolderDown,
  ExternalLink,
  Download,
  Copy,
  Check,
  Play,
  FileCode2,
  ChevronDown,
  ChevronUp,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Info
} from 'lucide-react';
import type { NavTab } from '../../lib/types';

interface DownloadsViewProps {
  onLoadConfig: (config: string) => void;
  onNavigate: (tab: NavTab) => void;
}

const CISCO_SAMPLE = `! ==============================================================================
! CISCO IOS-XE ENTERPRISE CORE ROUTER CONFIGURATION
! Device: Cisco ISR 4451-X / Catalyst 8300 Edge Gateway
! OS: Cisco IOS-XE Software, Version 16.09.04
! ==============================================================================
version 16.9
service timestamps debug datetime msec
service timestamps log datetime msec
service password-encryption
service call-home
hostname RTR-NYC-CORE-01
!
aaa new-model
aaa group server tacacs+ TACACS-CLUSTER
 server name TACACS-PRIMARY
 server name TACACS-SECONDARY
!
aaa authentication login default group TACACS-CLUSTER local
aaa authentication enable default group TACACS-CLUSTER enable
!
enable secret 5 $1$mER7$vX3Y80x1g0f7
enable password 7 0822455D0A16
!
username secops-admin privilege 15 secret 5 $1$f802$K3rN3lPr0t3ct89x
username netbackup-svc privilege 5 password 7 0822455D0A16
!
ip domain name enterprise-corp.net
ip name-server 10.200.1.10 10.200.1.11
login block-for 180 attempts 5 within 60
login on-failure log
login on-success log
!
interface GigabitEthernet0/0/0
 description Primary Internet Uplink
 ip address 203.0.113.1 255.255.255.248
 no shutdown
!
interface GigabitEthernet0/0/1
 description Core Corporate LAN
 ip address 10.100.1.1 255.255.255.0
 no shutdown
!
snmp-server community public RO
snmp-server host 10.200.1.50 version 2c SEC-TRAP
!
line con 0
 exec-timeout 10 0
 transport input none
 stopbits 1
line vty 0 4
 exec-timeout 15 0
 transport input telnet ssh
 login authentication default
line vty 5 15
 exec-timeout 15 0
 transport input ssh
 login authentication default
!
end`;

const JUNIPER_SAMPLE = `## ==============================================================================
## JUNIPER JUNOS SERVICES GATEWAY RUNNING CONFIGURATION
## Device: Juniper SRX340 Enterprise Services Gateway / Security Gateway
## OS: Junos OS 21.4R1-S2.4 | Exported: show configuration
## ==============================================================================
version 21.4R1.12;

system {
    host-name SRX-BORD-SEC-01;
    domain-name enterprise.corp.net;
    time-zone UTC;
    root-authentication {
        encrypted-password "$6$v98J2$pL0vN1XqVz7.T0sQG.oD7R1cKl0oF8tH4yvU5mK3b2w";
    }
    name-server {
        10.100.1.10;
        10.100.1.11;
    }
    login {
        message "AUTHORIZED PERSONNEL ONLY - ALL SESSIONS AUDITED";
        idle-timeout 10;
        retry-options {
            tries-before-disconnect 5;
            backoff-threshold 3;
            backoff-factor 5;
        }
        user admin {
            uid 2001;
            class super-user;
            authentication {
                encrypted-password "$6$k8Lm1$qP9xW2zE5rT8yU1iO4pA7sD0fG3hJ6kL9zX2cV5bN8";
            }
        }
        user netops-audit {
            uid 2004;
            class read-only;
            authentication {
                plain-text-password "AuditorFallback2026!";
            }
        }
    }
    services {
        ssh {
            protocol-version v2;
            rate-limit 3;
        }
        telnet;
        web-management {
            http {
                interface ge-0/0/0.0;
            }
            https {
                system-generated-certificate;
                interface [ ge-0/0/1.0 fxp0.0 ];
            }
        }
    }
    syslog {
        archive size 100k files 3;
        user * {
            any emergency;
        }
        host 10.100.1.50 {
            any any;
            facility-override local7;
        }
    }
}

snmp {
    community public {
        authorization read-only;
    }
}

interfaces {
    ge-0/0/0 {
        unit 0 {
            family inet {
                address 203.0.113.10/29;
            }
        }
    }
    ge-0/0/1 {
        unit 0 {
            family inet {
                address 10.10.1.1/24;
            }
        }
    }
}`;

const PALO_ALTO_SAMPLE = `# ==============================================================================
# PALO ALTO NETWORKS (PAN-OS) NEXT-GENERATION FIREWALL
# Device: PA-3200 Series High-Capacity Security Gateway
# Software Version: PAN-OS 10.2.4 Enterprise
# ==============================================================================

set deviceconfig system hostname PA-3200-PERIMETER-FW01
set deviceconfig system os-version 10.2.4
set deviceconfig system domain internal.corp.net
set deviceconfig system ip-address 10.0.50.10 netmask 255.255.255.0
set deviceconfig system default-gateway 10.0.50.1
set deviceconfig system dns-setting servers primary 10.0.1.10 secondary 10.0.1.11
set deviceconfig system ntp-servers primary-ntp-server ntp-server-address 10.0.1.1
set deviceconfig system timezone UTC
set deviceconfig system login-banner "AUTHORIZED ACCESS ONLY - CERT-IN & NIST SC-8 COMPLIANCE"

# Service Settings
set deviceconfig system service disable-telnet no
set deviceconfig system service disable-http yes
set deviceconfig system idle-timeout 15

# SNMP Community Settings
set deviceconfig system snmp-setting version v2c
set deviceconfig system snmp-setting community public

# Central Syslog
set shared log-settings syslog SEC-CENTRAL-SIEM server SIEM-COLLECTOR-01 server 10.0.50.100 transport UDP port 514 format BSD facility LOG_USER

# User Credentials
set mgt-config users admin password plainadmin123
set mgt-config users admin permissions role-based superuser yes
set mgt-config users secops phash $1$q983$kLs837FnKlp24NvxM981a/
set mgt-config users secops permissions role-based superuser yes

# Network Interfaces & Zones
set network interface ethernet ethernet1/1 layer3 ip 203.0.113.2/29
set network interface ethernet ethernet1/2 layer3 ip 10.10.1.1/24
set zone UNTRUST network layer3 ethernet1/1
set zone TRUST network layer3 ethernet1/2

# Security Rulebase
set rulebase security rules "ALLOW-INTERNAL-OUTBOUND" from TRUST to UNTRUST source any destination any application [ web-browsing ssl dns ping ] action allow log-end yes`;

const FORTINET_SAMPLE = `# ==============================================================================
# FORTINET FORTIGATE NEXT-GENERATION ENTERPRISE FIREWALL
# Device: FortiGate-100F Enterprise Appliance
# Firmware: FortiOS v7.2.4 GA (Build 1396)
# ==============================================================================

config system global
    set hostname "FGT-100F-CORP-EDGE"
    set admintimeout 10
    set admin-sport 8443
    set admin-ssh-port 22
    set admin-https-redirect enable
    set admin-lockout-threshold 3
    set admin-lockout-duration 300
    set pre-login-banner enable
    set timezone 04
end

config system admin
    edit "admin"
        set accprofile "super_admin"
        set vdom "root"
        set password-expire-warning 7
    next
end

config system interface
    edit "wan1"
        set vdom "root"
        set mode static
        set ip 198.51.100.50 255.255.255.248
        set allowaccess ping
        set type physical
        set description "Primary ISP Fiber Uplink"
    next
    edit "internal1"
        set vdom "root"
        set mode static
        set ip 10.20.1.1 255.255.255.0
        set allowaccess ping https ssh telnet
        set type physical
        set description "Trusted Corporate LAN"
    next
end

config system snmp community
    edit 1
        set name "public"
        config hosts
            edit 1
                set ip 10.20.1.50 255.255.255.255
            next
        end
    next
end

config firewall policy
    edit 1
        set name "CORP-OUTBOUND-INTERNET"
        set srcintf "internal1"
        set dstintf "wan1"
        set srcaddr "all"
        set dstaddr "all"
        set action accept
        set schedule "always"
        set service "ALL"
        set nat enable
    next
end`;

const UNIDENTIFIED_SAMPLE = `! ==============================================================================
! UNIDENTIFIED PROPRIETARY NETWORK APPLIANCE CONFIGURATION
! Hardware Target: EdgeCore Whitebox OpenSwitch (Unknown Vendor NOS)
! Architecture: Custom Proprietary CLI Syntax (Unmapped to Standard Parser)
! ==============================================================================
appliance-identifier sysname UNMAPPED-EDGE-SWITCH-01
system-hardware-profile edgecore-x9900-custom
firmware-release embedded-nos-v4.2.1

! Management Access Configuration
remote-session telnet-service state enabled port 23
remote-session ssh-daemon state enabled v1-only
admin-timeout idle-session-seconds 1800
login-policy max-failed-attempts 0

! Authentication Credentials
security-account user admin secret plain-text vector_admin_pass
security-account operator-level read-write

! Monitoring & Telemetry
snmp-agent community-string public access read-only
snmp-agent trap-target host 192.168.10.250
syslog-facility remote-host 192.168.10.50 level debug

! Interface Configuration
port-config ge-1/0/1 state active ip-addr 10.50.1.1 netmask 255.255.255.0
port-config ge-1/0/2 state active ip-addr 10.50.2.1 netmask 255.255.255.0
filter-rule incoming-traffic allow-all`;

interface ConfigItem {
  id: string;
  vendor: string;
  os: string;
  model: string;
  fileName: string;
  description: string;
  rawConfig: string;
  flaws: string[];
  frameworks: string[];
}

export const DownloadsView: React.FC<DownloadsViewProps> = ({ onLoadConfig, onNavigate }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1TY6I3fmB93jGXdZJuPXU9AXoURNfWqlt?usp=sharing';

  const configs: ConfigItem[] = [
    {
      id: 'cisco',
      vendor: 'Cisco Systems',
      os: 'IOS-XE 16.9.4',
      model: 'ISR 4451-X / Catalyst 8300',
      fileName: 'cisco_ios_router.cfg',
      description: 'Core Enterprise Edge Router configuration with BGP, OSPF, TACACS+ AAA, VRF Mgmt, and SSH/VTY lines.',
      rawConfig: CISCO_SAMPLE,
      flaws: ['Weak reversible Type-7 passwords', 'Telnet permitted on VTY lines', 'SNMP read-only string "public"'],
      frameworks: ['CIS Cisco IOS 16', 'NIST SP 800-53 IA-2', 'DISA STIG']
    },
    {
      id: 'juniper',
      vendor: 'Juniper Networks',
      os: 'Junos OS 21.4R1',
      model: 'SRX340 Services Gateway',
      fileName: 'juniper_junos_srx.conf',
      description: 'Next-Generation Security Gateway running hierarchical Junos syntax with zones, screens, and syslog forwarding.',
      rawConfig: JUNIPER_SAMPLE,
      flaws: ['Cleartext Telnet service active', 'Plaintext password on netops-audit user', 'SNMP v2c community "public"'],
      frameworks: ['CIS Juniper Junos 21', 'NIST SP 800-53 AC-17', 'CERT-In']
    },
    {
      id: 'paloalto',
      vendor: 'Palo Alto Networks',
      os: 'PAN-OS 10.2.4',
      model: 'PA-3220 Next-Gen Firewall',
      fileName: 'paloalto_panos_firewall.cfg',
      description: 'Perimeter Security Appliance with Set-Command hierarchy, zone mappings, threat prevention, and SIEM logging.',
      rawConfig: PALO_ALTO_SAMPLE,
      flaws: ['disable-telnet set to "no"', 'Plaintext user credentials in configuration', 'SNMP community "public"'],
      frameworks: ['CIS PAN-OS 10.x', 'NIST SP 800-53 SC-8', 'ISO 27001']
    },
    {
      id: 'fortinet',
      vendor: 'Fortinet',
      os: 'FortiOS 7.2.4 GA',
      model: 'FortiGate-100F Enterprise',
      fileName: 'fortinet_fortigate_firewall.conf',
      description: 'Enterprise NGFW backup configuration with VDOMs, administrative lockout, interface allowaccess, and UTM policies.',
      rawConfig: FORTINET_SAMPLE,
      flaws: ['Telnet enabled in internal allowaccess', 'SNMP community string "public"', 'Unrestricted outbound permit rule'],
      frameworks: ['CIS FortiOS 7.x', 'NIST SP 800-53 CM-7', 'CERT-In']
    },
    {
      id: 'unidentified',
      vendor: 'Unidentified Whitebox',
      os: 'Embedded NOS v4.2',
      model: 'EdgeCore OpenSwitch',
      fileName: 'unidentified_custom_switch.cfg',
      description: 'Proprietary non-standard CLI syntax designed to validate AI vector embedding and unmapped rule extraction.',
      rawConfig: UNIDENTIFIED_SAMPLE,
      flaws: ['Port 23 Telnet daemon enabled', 'Plaintext secret credential', 'Insecure SNMP v1 community'],
      frameworks: ['VectorNet Semantic Parser', 'NIST SP 800-53 IR-4']
    }
  ];

  const handleCopy = (id: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleDownloadFile = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLoadAndNavigate = (configText: string) => {
    onLoadConfig(configText);
    onNavigate('ingestion');
  };

  const handleLoadCombinedFleet = () => {
    const combined = `# ==============================================================================
# HETEROGENEOUS MULTI-VENDOR FLEET AUDIT BUNDLE
# Evaluator: Smart India Hackathon 2026 Jury
# Devices Included: Cisco IOS-XE, Juniper Junos, Palo Alto PAN-OS, Fortinet FortiOS
# ==============================================================================

${CISCO_SAMPLE}

! --- SECTION DIVIDER: JUNIPER JUNOS ---
${JUNIPER_SAMPLE}

! --- SECTION DIVIDER: PALO ALTO PAN-OS ---
${PALO_ALTO_SAMPLE}

! --- SECTION DIVIDER: FORTINET FORTIOS ---
${FORTINET_SAMPLE}
`;
    onLoadConfig(combined);
    onNavigate('ingestion');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8 space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-50 text-orange-800 border border-orange-200">
              EVALUATION BENCHMARK DATASETS
            </span>
            <span className="text-xs text-slate-500 font-mono">SIH 2026</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Sample network configurations & test repository
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            Standardized production configuration dumps for Cisco, Juniper, Palo Alto, and Fortinet devices. Use these benchmark files to verify automated parsing, CIS/NIST compliance scoring, and CLI remediation generation.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleLoadCombinedFleet}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-orange-400" />
            <span>Load 4-vendor fleet bundle</span>
          </button>

          <a
            href={DRIVE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <FolderDown className="w-3.5 h-3.5" />
            <span>Open Google Drive repository</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* Primary Google Drive Callout Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0 mt-0.5">
            <FolderDown className="w-5 h-5 text-orange-600" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                Official Google Drive test configurations repository
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Direct Cloud Access
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl leading-normal">
              Download raw <code className="px-1 py-0.5 bg-slate-100 rounded text-slate-800 text-[11px]">.cfg</code> and <code className="px-1 py-0.5 bg-slate-100 rounded text-slate-800 text-[11px]">.conf</code> configuration dumps directly to your local file system, or share them with fellow evaluators.
            </p>
            <div className="text-[11px] text-slate-500 font-mono truncate max-w-xl">
              {DRIVE_FOLDER_URL}
            </div>
          </div>
        </div>

        <a
          href={DRIVE_FOLDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-900 border border-slate-300 rounded-lg text-xs font-semibold transition-colors shrink-0"
        >
          <span>Open Drive folder</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
        </a>
      </div>

      {/* Evaluation Datasets Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-slate-700 uppercase font-mono tracking-wider">
            Available Benchmark Files ({configs.length})
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">
            Click &quot;Load into Ingestion&quot; to test immediately
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {configs.map((cfg) => {
            const isExpanded = expandedId === cfg.id;
            const isCopied = copiedId === cfg.id;

            return (
              <div
                key={cfg.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Vendor & File Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {cfg.vendor}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-mono border border-slate-200">
                        {cfg.os}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        [{cfg.model}]
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileCode2 className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      <code className="text-xs font-mono font-bold text-slate-800 bg-orange-50/60 px-1.5 py-0.5 rounded border border-orange-100">
                        {cfg.fileName}
                      </code>
                    </div>

                    <p className="text-xs text-slate-600 leading-normal">
                      {cfg.description}
                    </p>

                    {/* Security flaws tested */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase font-mono mr-1">
                        Injected Flaws:
                      </span>
                      {cfg.flaws.map((flaw, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded text-[10px] font-medium"
                        >
                          {flaw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 md:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleLoadAndNavigate(cfg.rawConfig)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                      title="Load this config into the Ingestion workspace and launch audit"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Load into Ingestion</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadFile(cfg.fileName, cfg.rawConfig)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                      title="Download configuration file locally"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Download</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(cfg.id, cfg.rawConfig)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                      title="Copy raw configuration to clipboard"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 text-[11px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-[11px]">Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : cfg.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      <span className="text-[11px]">{isExpanded ? 'Hide' : 'Preview'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Raw Syntax Preview */}
                {isExpanded && (
                  <div className="border-t border-slate-200 bg-slate-900 text-slate-200 p-4 font-mono text-[11px] overflow-x-auto max-h-72">
                    <pre className="whitespace-pre">{cfg.rawConfig}</pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Jury Evaluation Instructions Card */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
            Evaluation workflow guidelines for judges
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-slate-800 block">1. Individual Device Audit</span>
            <p className="text-[11px] leading-normal text-slate-600">
              Click &quot;Load into Ingestion&quot; next to any vendor configuration. Notice automatic vendor OS fingerprinting and immediate CIS/NIST rule execution.
            </p>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-slate-800 block">2. Heterogeneous Fleet Audit</span>
            <p className="text-[11px] leading-normal text-slate-600">
              Click &quot;Load 4-vendor fleet bundle&quot; to test cross-platform normalization. The parser simultaneously evaluates multi-vendor network syntax.
            </p>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-slate-800 block">3. Remediation & Task Allocation</span>
            <p className="text-[11px] leading-normal text-slate-600">
              Navigate to &quot;Remediation&quot; or &quot;Team Tasks&quot; to inspect auto-generated rollback scripts and engineer role dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
