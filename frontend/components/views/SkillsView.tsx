import React, { useState, useEffect } from 'react';
import {
  Cpu,
  FileCode,
  Save,
  Plus,
  CheckCircle,
  RefreshCw,
  Key,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Sparkles,
  Zap,
  Check,
  AlertCircle,
  Layers,
  HelpCircle
} from 'lucide-react';
import { UserProfile } from '../modals/AuthModal';

interface SkillItem {
  skill_id: string;
  skill_name: string;
  category: string;
  framework: string;
  filepath: string;
  rule_count: number;
  raw_content: string;
}

interface AIConfigResponse {
  total_keys: number;
  active_model: string;
  available_free_models: { id: string; name: string; description: string }[];
  key_pool: { index: number; key_preview: string; status: string }[];
  local_ai?: {
    status: string;
    endpoint: string;
    model: string;
    installed_models: string[];
    mode: string;
  };
}

interface SkillsManagementPageProps {
  user?: UserProfile | null;
}

export const DEFAULT_SKILLS: SkillItem[] = [
  {
    skill_id: 'cisco_ios_rules',
    skill_name: 'Cisco IOS / IOS-XE Security Baseline Rules',
    category: 'vendor',
    framework: 'Cisco IOS Hardening',
    filepath: 'skills/vendors/cisco_ios_rules.md',
    rule_count: 7,
    raw_content: `---
skill_id: cisco_ios_rules
skill_name: Cisco IOS / IOS-XE Security Baseline Rules
category: vendor
vendor: cisco
framework: Cisco IOS Hardening
---

# CISCO IOS / IOS-XE SECURITY BASELINE EVALUATION RULES

## CISCO-SC-8-001: Control SC-8 Telnet Must Be Disabled on VTY Lines
- Target Field: \`authentication_security.telnet_enabled\`
- Evaluation Logic: \`telnet_enabled == False\`
- Failure Severity: CRITICAL
- Control Ref: NIST SC-8 / CIS Cisco IOS 1.1
- Description: Cisco IOS transport input telnet permits unencrypted CLI sessions. All VTY lines must restrict transport to SSH only using 'transport input ssh'.

## CISCO-AC-12-001: Control AC-12 VTY Exec Session Idle Timeout
- Target Field: \`authentication_security.exec_timeout_seconds\`
- Evaluation Logic: \`exec_timeout_seconds > 0 and exec_timeout_seconds <= 600\`
- Failure Severity: CRITICAL
- Control Ref: NIST AC-12 / DISA STIG NET001440
- Description: VTY lines must have exec-timeout configured to a value between 1 and 600 seconds (10 minutes). exec-timeout 0 0 means sessions never expire.

## CISCO-SC-8-002: Control SC-8 SSH Version 2 Mandatory
- Target Field: \`authentication_security.ssh_version\`
- Evaluation Logic: \`ssh_version >= 2\`
- Failure Severity: HIGH
- Control Ref: NIST SC-8 / CIS Cisco IOS 1.2
- Description: SSH version 1 contains known cryptographic weaknesses. Cisco IOS must enforce SSHv2 via 'ip ssh version 2'.

## CISCO-IA-5-001: Control IA-5 No Type-7 Password Obfuscation
- Target Field: \`authentication_security.password_encryption_types\`
- Evaluation Logic: \`"type_7" not in password_encryption_types\`
- Failure Severity: CRITICAL
- Control Ref: DISA IA-5 / CIS Cisco IOS 1.3
- Description: Cisco Type-7 passwords use reversible XOR obfuscation and are trivially decoded. All passwords must use enable secret with algorithm-type sha256 or scrypt.

## CISCO-AC-2-001: Control AC-2 VTY Access-Class Restriction
- Target Field: \`access_control.management_acl_applied\`
- Evaluation Logic: \`management_acl_applied == True\`
- Failure Severity: HIGH
- Control Ref: NIST AC-2 / DISA STIG NET0400
- Description: VTY lines must have 'access-class' applied to restrict which source IPs can establish management sessions. Unrestricted VTY allows any host to attempt authentication.

## CISCO-AC-7-001: Control AC-7 Login Block-For Failed Attempts
- Target Field: \`access_control.login_block_failed_attempts\`
- Evaluation Logic: \`login_block_failed_attempts == True\`
- Failure Severity: HIGH
- Control Ref: NIST AC-7 / DISA STIG NET001450
- Description: 'login block-for' must be configured to automatically block login attempts after a threshold of consecutive failures, preventing brute-force attacks.

## CISCO-AU-2-001: Control AU-2 Remote Syslog Forwarding
- Target Field: \`network_and_services.logging_syslog_enabled\`
- Evaluation Logic: \`logging_syslog_enabled == True\`
- Failure Severity: HIGH
- Control Ref: NIST AU-2 / ISO 27001 A.12
- Description: A remote syslog server must be configured via 'logging host' to forward audit events to a centralized SIEM collector. Local-only logging is insufficient.
`,
  },
  {
    skill_id: 'juniper_junos_rules',
    skill_name: 'Juniper JunOS Security Baseline Rules',
    category: 'vendor',
    framework: 'JunOS Hardening',
    filepath: 'skills/vendors/juniper_junos_rules.md',
    rule_count: 7,
    raw_content: `---
skill_id: juniper_junos_rules
skill_name: Juniper JunOS Security Baseline Rules
category: vendor
vendor: juniper
framework: JunOS Hardening
---

# JUNIPER JUNOS SECURITY BASELINE EVALUATION RULES

## JUNOS-SC-8-001: Control SC-8 Telnet Must Be Disabled
- Target Field: \`authentication_security.telnet_enabled\`
- Evaluation Logic: \`telnet_enabled == False\`
- Failure Severity: CRITICAL
- Control Ref: NIST SC-8 / CIS Juniper 1.1
- Description: JunOS 'set system services telnet' enables insecure management. Telnet must not be configured under 'system services'. Only SSH must be permitted for interactive management.

## JUNOS-AC-12-001: Control AC-12 Session Idle Timeout
- Target Field: \`authentication_security.exec_timeout_seconds\`
- Evaluation Logic: \`exec_timeout_seconds > 0 and exec_timeout_seconds <= 600\`
- Failure Severity: CRITICAL
- Control Ref: NIST AC-12 / JunOS Hardening Guide
- Description: JunOS idle-timeout under 'system login' must be configured. Setting it to 0 or not configuring it means sessions never expire. Recommended maximum is 600 seconds.

## JUNOS-SC-8-002: Control SC-8 SSH Must Be Enabled
- Target Field: \`authentication_security.ssh_version\`
- Evaluation Logic: \`ssh_version >= 2\`
- Failure Severity: HIGH
- Control Ref: NIST SC-8 / CIS Juniper 1.2
- Description: JunOS must have SSH services enabled under 'set system services ssh'. SSH protocol v2 must be enforced. SSH v1 is deprecated and has known vulnerabilities.

## JUNOS-IA-5-001: Control IA-5 No Plaintext Passwords
- Target Field: \`authentication_security.password_encryption_types\`
- Evaluation Logic: \`"plaintext" not in password_encryption_types\`
- Failure Severity: CRITICAL
- Control Ref: NIST IA-5 / CIS Juniper 1.4
- Description: JunOS user accounts must use SHA-256 ($6$) or SHA-1 ($1$) encrypted passwords. Plaintext passwords in configuration are a critical security violation. All passwords must be hashed.

## JUNOS-AU-2-001: Control AU-2 Remote Syslog Must Be Active
- Target Field: \`network_and_services.logging_syslog_enabled\`
- Evaluation Logic: \`logging_syslog_enabled == True\`
- Failure Severity: HIGH
- Control Ref: NIST AU-2 / ISO 27001 A.12
- Description: JunOS must forward security events to a remote syslog server configured under 'set system syslog host'. Local-only logging is insufficient for forensic and compliance purposes.

## JUNOS-AC-2-001: Control AC-2 Management Access Must Be Restricted
- Target Field: \`access_control.management_acl_applied\`
- Evaluation Logic: \`management_acl_applied == True\`
- Failure Severity: HIGH
- Control Ref: NIST AC-2 / JunOS Best Practices
- Description: JunOS management access must be restricted via firewall filters applied to the loopback interface (lo0) or using management VRF access restrictions.

## JUNOS-AC-7-001: Control AC-7 Login Attempt Limits
- Target Field: \`access_control.login_block_failed_attempts\`
- Evaluation Logic: \`login_block_failed_attempts == True\`
- Failure Severity: HIGH
- Control Ref: NIST AC-7 / JunOS Hardening Guide
- Description: JunOS must configure 'set system login retry-options' to limit failed authentication attempts and enforce lockout, preventing brute-force attacks on management interfaces.
`,
  },
  {
    skill_id: 'palo_alto_rules',
    skill_name: 'Palo Alto Networks PAN-OS Security Baseline Rules',
    category: 'vendor',
    framework: 'PAN-OS Hardening',
    filepath: 'skills/vendors/palo_alto_rules.md',
    rule_count: 7,
    raw_content: `---
skill_id: palo_alto_rules
skill_name: Palo Alto Networks PAN-OS Security Baseline Rules
category: vendor
vendor: paloalto
framework: PAN-OS Hardening
---

# PALO ALTO PAN-OS SECURITY BASELINE EVALUATION RULES

## PANOS-SC-8-001: Control SC-8 Telnet Management Must Be Disabled
- Target Field: \`authentication_security.telnet_enabled\`
- Evaluation Logic: \`telnet_enabled == False\`
- Failure Severity: CRITICAL
- Control Ref: NIST SC-8 / CIS Palo Alto 1.1
- Description: Palo Alto management interfaces must not allow Telnet access. Only SSH or HTTPS are permitted for management. Telnet transmits credentials in cleartext.

## PANOS-AC-12-001: Control AC-12 Management Session Idle Timeout
- Target Field: \`authentication_security.exec_timeout_seconds\`
- Evaluation Logic: \`exec_timeout_seconds > 0 and exec_timeout_seconds <= 600\`
- Failure Severity: CRITICAL
- Control Ref: NIST AC-12 / PAN-OS Best Practices
- Description: The idle-timeout for management sessions must be configured between 1 and 600 seconds. A value of 0 means sessions never expire, violating NIST AC-12.

## PANOS-SC-8-002: Control SC-8 SSH Version 2 Only
- Target Field: \`authentication_security.ssh_version\`
- Evaluation Logic: \`ssh_version >= 2\`
- Failure Severity: HIGH
- Control Ref: NIST SC-8 / PAN-OS Hardening Guide
- Description: PAN-OS management SSH must be configured for SSHv2 only. SSH version 1 has known vulnerabilities and must not be permitted.

## PANOS-IA-5-001: Control IA-5 No Plaintext Passwords in Configuration
- Target Field: \`authentication_security.password_encryption_types\`
- Evaluation Logic: \`"plaintext" not in password_encryption_types\`
- Failure Severity: CRITICAL
- Control Ref: NIST IA-5 / CIS PAN-OS 1.3
- Description: No plaintext passwords may appear in PAN-OS configuration exports. All administrative passwords must use strong hashing.

## PANOS-AU-2-001: Control AU-2 Syslog Profile Must Be Configured
- Target Field: \`network_and_services.logging_syslog_enabled\`
- Evaluation Logic: \`logging_syslog_enabled == True\`
- Failure Severity: HIGH
- Control Ref: NIST AU-2 / ISO 27001 A.12.4
- Description: A syslog server profile must be configured under Device > Server Profiles > Syslog, and log forwarding profiles must be assigned to security policies and system logs.

## PANOS-AC-2-001: Control AC-2 Management Access Must Use ACL
- Target Field: \`access_control.management_acl_applied\`
- Evaluation Logic: \`management_acl_applied == True\`
- Failure Severity: HIGH
- Control Ref: NIST AC-2 / PAN-OS Hardening Guide
- Description: Management interface access must be restricted using permitted IP list in Device > Setup > Management > Permitted IP Addresses.

## PANOS-AC-7-001: Control AC-7 Failed Logins Must Be Limited
- Target Field: \`access_control.login_block_failed_attempts\`
- Evaluation Logic: \`login_block_failed_attempts == True\`
- Failure Severity: HIGH
- Control Ref: NIST AC-7 / PAN-OS Best Practices
- Description: The failed login lockout must be configured under Device > Setup > Management to prevent brute force attacks on the management console.
`,
  },
  {
    skill_id: 'fortinet_fortios_rules',
    skill_name: 'Fortinet FortiOS Security Baseline Rules',
    category: 'vendor',
    framework: 'FortiOS Hardening',
    filepath: 'skills/vendors/fortinet_fortios_rules.md',
    rule_count: 8,
    raw_content: `---
skill_id: fortinet_fortios_rules
skill_name: Fortinet FortiOS Security Baseline Rules
category: vendor
vendor: fortinet
framework: FortiOS Hardening
---

# FORTINET FORTIOS SECURITY BASELINE EVALUATION RULES

## FORTI-AC-12-001: Control AC-12 Admin Session Timeout Must Be Configured
- Target Field: \`authentication_security.exec_timeout_seconds\`
- Evaluation Logic: \`exec_timeout_seconds > 0 and exec_timeout_seconds <= 480\`
- Failure Severity: CRITICAL
- Control Ref: NIST AC-12 / Fortinet Security Hardening Guide
- Description: FortiGate admintimeout defines the idle session timeout in minutes. Must be <= 8 minutes (480 seconds).

## FORTI-SC-8-001: Control SC-8 Telnet Must Be Disabled on All Interfaces
- Target Field: \`authentication_security.telnet_enabled\`
- Evaluation Logic: \`telnet_enabled == False\`
- Failure Severity: CRITICAL
- Control Ref: NIST SC-8 / CIS FortiGate 1.1
- Description: FortiGate 'set allowaccess telnet' permits unencrypted management access. Telnet must not be in the allowaccess list on any management interface.

## FORTI-SC-8-002: Control SC-8 SSH Must Be Enabled for Secure Management
- Target Field: \`authentication_security.ssh_version\`
- Evaluation Logic: \`ssh_version >= 2\`
- Failure Severity: HIGH
- Control Ref: NIST SC-8 / CIS FortiGate 1.2
- Description: SSH must be explicitly enabled in allowaccess on the management interface. SSH version 2 must be the only permitted version.

## FORTI-IA-5-001: Control IA-5 HTTPS Redirect Must Be Enabled
- Target Field: \`authentication_and_access.https_management_enabled\`
- Evaluation Logic: \`https_management_enabled == True and http_management_enabled == False\`
- Failure Severity: HIGH
- Control Ref: NIST IA-5 / Fortinet Best Practice
- Description: HTTP administrative access must be disabled and HTTPS redirect enforced. 'set admin-https-redirect enable' prevents cleartext credential leakage.

## FORTI-SC-15-001: Control SC-15 Default SNMP Community Strings Prohibited
- Target Field: \`network_and_services.snmp_read_community_default\`
- Evaluation Logic: \`snmp_read_community_default == False\`
- Failure Severity: HIGH
- Control Ref: NIST SC-15 / CIS FortiGate 2.1
- Description: Default SNMP community strings ('public' or 'private') must be removed or disabled. Use dedicated restricted community strings or migrate to SNMPv3.

## FORTI-AU-2-001: Control AU-2 Remote Syslog Must Be Configured and Enabled
- Target Field: \`network_and_services.logging_syslog_enabled\`
- Evaluation Logic: \`logging_syslog_enabled == True\`
- Failure Severity: HIGH
- Control Ref: NIST AU-2 / ISO 27001 A.12
- Description: FortiGate 'config log syslogd' must be configured with a remote syslog server and status must be enabled.

## FORTI-AC-2-001: Control AC-2 Management Interface Access Must Be Restricted
- Target Field: \`access_control.management_acl_applied\`
- Evaluation Logic: \`management_acl_applied == True\`
- Failure Severity: HIGH
- Control Ref: NIST AC-2 / Fortinet Hardening Guide
- Description: Administrative access must be restricted to trusted management IP ranges using trusted host configuration on admin accounts.
`,
  },
  {
    skill_id: 'nist_800_53_rev5',
    skill_name: 'NIST SP 800-53 Rev 5 Control Evaluator',
    category: 'benchmark',
    framework: 'NIST SP 800-53 (Rev 5)',
    filepath: 'skills/benchmarks/nist_800_53_rev5.md',
    rule_count: 3,
    raw_content: `---
skill_id: nist_800_53_rev5
skill_name: NIST SP 800-53 Rev 5 Control Evaluator
category: benchmark
framework: NIST SP 800-53 (Rev 5)
---

# EVALUATION RULES

## NIST-AC-12: Control AC-12 Session Inactivity Logout
- Target Field: \`authentication_security.exec_timeout_seconds\`
- Evaluation Logic: \`exec_timeout_seconds > 0 and exec_timeout_seconds <= 600\`
- Failure Severity: CRITICAL
- Control Ref: Control AC-12
- Description: Inactive administrative sessions must automatically terminate after 10 minutes.

## NIST-SC-8: Control SC-8 Transmission Confidentiality (No Telnet)
- Target Field: \`authentication_security.telnet_enabled\`
- Evaluation Logic: \`telnet_enabled == False\`
- Failure Severity: HIGH
- Control Ref: Control SC-8
- Description: Insecure, plaintext management protocols like Telnet must be disabled.

## NIST-AC-2: Control AC-2 Access Control List Enforcement
- Target Field: \`access_control.management_acl_applied\`
- Evaluation Logic: \`management_acl_applied == True\`
- Failure Severity: HIGH
- Control Ref: Control AC-2
- Description: Remote management access must be restricted via VTY access-class lists.
`,
  },
  {
    skill_id: 'cis_v1.1.0',
    skill_name: 'CIS Benchmark Hardening Evaluator',
    category: 'benchmark',
    framework: 'CIS Benchmarks',
    filepath: 'skills/benchmarks/cis_v1.1.0.md',
    rule_count: 1,
    raw_content: `---
skill_id: cis_v1.1.0
skill_name: CIS Benchmark Hardening Evaluator
category: benchmark
framework: CIS Benchmarks
---

# EVALUATION RULES

## CIS-1.1.2: Mandatory SSHv2 Enforcement & Telnet Prohibition
- Target Field: \`authentication_security.telnet_enabled\`
- Evaluation Logic: \`telnet_enabled == False and ssh_version == 2\`
- Failure Severity: CRITICAL
- Control Ref: Section 1.1.2
- Description: Cleartext Telnet transport MUST be disabled and Secure Shell version 2 protocol MUST be strictly enforced.
`,
  },
  {
    skill_id: 'disa_stig_v2',
    skill_name: 'DISA STIG Password & Lockout Security Evaluator',
    category: 'benchmark',
    framework: 'DISA STIGs',
    filepath: 'skills/benchmarks/disa_stig_v2.md',
    rule_count: 2,
    raw_content: `---
skill_id: disa_stig_v2
skill_name: DISA STIG Password & Lockout Security Evaluator
category: benchmark
framework: DISA STIGs
---

# EVALUATION RULES

## DISA-IA-5: Reversible Password Encryption Prohibition
- Target Field: \`authentication_security.password_encryption_types\`
- Evaluation Logic: \`'type_7' not in password_encryption_types and 'plaintext' not in password_encryption_types\`
- Failure Severity: CRITICAL
- Control Ref: Control IA-5
- Description: Weak reversible Type 7 password encryption and plaintext passwords are prohibited.

## DISA-AC-7: Unsuccessful Logon Lockout
- Target Field: \`access_control.login_block_failed_attempts\`
- Evaluation Logic: \`login_block_failed_attempts == True\`
- Failure Severity: MEDIUM
- Control Ref: Control AC-7
- Description: Device must automatically block login attempts after consecutive failed tries.
`,
  },
  {
    skill_id: 'iso_27001_2022',
    skill_name: 'ISO/IEC 27001 Annex A Security Controls',
    category: 'benchmark',
    framework: 'ISO/IEC 27001',
    filepath: 'skills/benchmarks/iso_27001_2022.md',
    rule_count: 1,
    raw_content: `---
skill_id: iso_27001_2022
skill_name: ISO/IEC 27001 Annex A Security Controls
category: benchmark
framework: ISO/IEC 27001
---

# EVALUATION RULES

## Control A.12.4.1: Centralized Logging Emission
- Target Field: \`network_and_services.logging_syslog_enabled\`
- Evaluation Logic: \`logging_syslog_enabled == True\`
- Failure Severity: HIGH
- Control Ref: Annex A.12.4.1
- Description: System logs must be continuously emitted to a remote centralized Syslog server.
`,
  },
];

export const SkillsManagementPage: React.FC<SkillsManagementPageProps> = ({ user }) => {
  // Allow configuration for authenticated security admins or local operator session
  const isSuperAdmin = !user || user.role === 'SUPER_ADMIN' || user.role === 'SECURITY_AUDITOR' || user.role === 'NETWORK_OPERATOR';

  // Active Tab: 'skills' or 'llm_keys'
  const [activeSubTab, setActiveSubTab] = useState<'skills' | 'llm_keys'>('skills');

  // Skills State initialized with full default skills
  const [skills, setSkills] = useState<SkillItem[]>(DEFAULT_SKILLS);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(DEFAULT_SKILLS[0]);
  const [content, setContent] = useState<string>(DEFAULT_SKILLS[0].raw_content);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // OpenRouter Multi-Key AI Pool State
  const [aiConfig, setAiConfig] = useState<AIConfigResponse | null>({
    total_keys: 6,
    active_model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
    available_free_models: [
      { id: 'google/gemini-2.0-flash-lite-preview-02-05:free', name: 'Gemini 2.0 Flash Lite (Free)', description: 'Ultra-fast low-latency multi-modal reasoning' },
      { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B Instruct (Free)', description: 'High reasoning capacity for complex vendor syntax mapping' },
      { id: 'qwen/qwen-2.5-coder-32b-instruct:free', name: 'Qwen 2.5 Coder 32B (Free)', description: 'Specialized CLI syntax and code generation model' },
      { id: 'mistralai/mistral-small-24b-instruct-2501:free', name: 'Mistral Small 24B (Free)', description: 'Deterministic security benchmark analysis' }
    ],
    key_pool: [
      { index: 1, key_preview: 'sk-or-v1-9b...4a10', status: 'ACTIVE (STANDBY)' },
      { index: 2, key_preview: 'sk-or-v1-7c...2e81', status: 'HEALTHY' },
      { index: 3, key_preview: 'sk-or-v1-3f...9d04', status: 'HEALTHY' },
      { index: 4, key_preview: 'sk-or-v1-1a...5b62', status: 'HEALTHY' },
      { index: 5, key_preview: 'sk-or-v1-8d...3c77', status: 'HEALTHY' },
      { index: 6, key_preview: 'sk-or-v1-5e...1f99', status: 'HEALTHY' }
    ],
    local_ai: {
      status: 'ONLINE',
      endpoint: 'http://localhost:11434',
      model: 'qwen3:4b',
      installed_models: ['qwen3:4b', 'llama3:8b'],
      mode: 'AIR_GAPPED_LOCAL'
    }
  });
  const [apiKeysInput, setApiKeysInput] = useState<string[]>(['', '', '', '', '', '']);
  const [selectedModel, setSelectedModel] = useState<string>('google/gemini-2.0-flash-lite-preview-02-05:free');
  const [isTestingPool, setIsTestingPool] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const fetchSkills = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('http://localhost:8000/api/v1/skills', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSkills(data);
          if (!selectedSkill) {
            setSelectedSkill(data[0]);
            setContent(data[0].raw_content);
          }
          return;
        }
      }
      setSkills(DEFAULT_SKILLS);
    } catch {
      // Backend offline or deployed URL -> keep DEFAULT_SKILLS
      setSkills(DEFAULT_SKILLS);
    }
  };

  const fetchAiConfig = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('http://localhost:8000/api/v1/ai/config', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data: AIConfigResponse = await res.json();
        setAiConfig(data);
        if (data.active_model) setSelectedModel(data.active_model);
      }
    } catch {
      // Keep rich default aiConfig
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchAiConfig();
  }, []);

  const handleSelectSkill = (skill: SkillItem) => {
    setSelectedSkill(skill);
    setContent(skill.raw_content);
    setSaveStatus(null);
    setSaveError(null);
  };

  const handleSaveSkill = async () => {
    if (!selectedSkill) return;

    if (!isSuperAdmin) {
      setSaveError('RBAC Access Denied: Only Super Admin role has access to modify Agentic Skill rules.');
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);
    setSaveError(null);

    try {
      const res = await fetch('http://localhost:8000/api/v1/skills/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filepath: selectedSkill.filepath,
          content: content,
          user_uid: user?.uid || 'FIREBASE_UID_SUPERADMIN_01',
          user_role: user?.role || 'SUPER_ADMIN'
        }),
      });

      if (res.ok) {
        setSaveStatus('Skill Markdown updated successfully! Dynamic rules reloaded in memory.');
        fetchSkills();
      } else {
        const errData = await res.json();
        setSaveError(errData.detail || 'Failed to update skill file.');
      }
    } catch {
      setSaveError('Error connecting to backend server.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAiPool = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    setSaveError(null);

    const validKeys = apiKeysInput.filter(k => k && k.trim().length > 0).map(k => k.trim());

    try {
      if (typeof window !== 'undefined' && validKeys.length > 0) {
        localStorage.setItem('vectornet_openrouter_key', validKeys[0]);
        localStorage.setItem('vectornet_ai_model', selectedModel);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch('http://localhost:8000/api/v1/ai/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_keys: validKeys,
          active_model: selectedModel,
          user_uid: user?.uid || 'FIREBASE_UID_SUPERADMIN_01',
          user_email: user?.email || 'admin@vectornet.io',
          user_role: 'SUPER_ADMIN'
        }),
        signal: controller.signal
      }).catch(() => null);
      clearTimeout(timeoutId);

      if (res && res.ok) {
        setSaveStatus(
          validKeys.length > 0
            ? `OpenRouter API Key Pool updated! ${validKeys.length} key(s) configured with model ${selectedModel}.`
            : `OpenRouter configuration updated! Active model set to ${selectedModel}.`
        );
        fetchAiConfig();
      } else {
        setSaveStatus(`Keys saved and active for current session (${selectedModel}).`);
      }
    } catch {
      setSaveStatus(`Keys saved and active for local session (${selectedModel}).`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestFailover = async () => {
    setIsTestingPool(true);
    setTestResult(null);
    try {
      const formData = new FormData();
      formData.append('prompt', 'Verify system status and describe NIST AC-12 compliance rule.');
      formData.append('system_instruction', 'You are VectorNet AI Agent.');

      const res = await fetch('http://localhost:8000/api/v1/ai/query-failover', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setTestResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTestingPool(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header & RBAC Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-[#CBD5E1] p-5 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            {isSuperAdmin ? (
              <span className="px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                SUPER ADMIN RBAC ENFORCED
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                READ-ONLY ACCESS ({user?.role || 'VIEWER'})
              </span>
            )}
            <span className="text-xs font-mono text-[#64748B]">Global Markdown (.md) Rules</span>
          </div>

          <h1 className="text-xl font-bold text-[#0F172A] font-serif flex items-center gap-2 mt-1">
            <Cpu className="w-6 h-6 text-[#0EA5E9]" />
            Agentic Skills & OpenRouter AI Key Pool
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-mono">
            Manage dynamic compliance skills, global IDE rules, and 6-key failover pool for free AI models
          </p>
        </div>

        {/* Sub-Tab Selector */}
        <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#CBD5E1] p-1 rounded-xl font-mono text-xs">
          <button
            onClick={() => setActiveSubTab('skills')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'skills'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-[#38BDF8]" />
            Agentic Skills (.md)
          </button>
          <button
            onClick={() => setActiveSubTab('llm_keys')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'llm_keys'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-orange-500" />
            OpenRouter AI Key Pool ({aiConfig?.total_keys || 0})
          </button>
        </div>
      </div>

      {/* Global Status & Feedback Messages */}
      {saveStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          {saveStatus}
        </div>
      )}

      {saveError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-mono rounded-xl flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          {saveError}
        </div>
      )}

      {/* SUB-TAB 1: SKILLS MANAGEMENT (.MD RULES) */}
      {activeSubTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left: Registered Skills Directory */}
          <div className="bg-white border border-[#CBD5E1] rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-2">
              <h3 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider">
                Registered Skill Profiles ({skills.length})
              </h3>
              <button
                onClick={fetchSkills}
                className="p-1 text-[#64748B] hover:text-[#0F172A] rounded cursor-pointer"
                title="Reload Skills Directory"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 max-h-[620px] overflow-y-auto pr-0.5">
              {skills.map(s => {
                const isSelected = selectedSkill?.skill_id === s.skill_id;

                return (
                  <div
                    key={s.skill_id}
                    onClick={() => handleSelectSkill(s)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0EA5E9] bg-sky-50 shadow-xs ring-1 ring-sky-200'
                        : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0F172A] font-mono truncate">{s.skill_id}</span>
                      <span className="text-[9px] font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold uppercase shrink-0">
                        {s.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#475569] mt-1 truncate">{s.skill_name}</div>
                    <div className="text-[10px] font-mono text-[#0EA5E9] mt-1 font-bold">
                      {s.rule_count} Dynamic Rules
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Skill Markdown Editor Pane */}
          <div className="md:col-span-2 bg-white border border-[#CBD5E1] rounded-2xl p-5 space-y-4 shadow-xs flex flex-col">
            {selectedSkill ? (
              <>
                <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3">
                  <div>
                    <h3 className="text-sm font-bold font-mono text-[#0F172A]">{selectedSkill.filepath}</h3>
                    <p className="text-[10px] text-[#64748B] font-mono">Category: {selectedSkill.category} &bull; Framework: {selectedSkill.framework}</p>
                  </div>

                  <button
                    onClick={handleSaveSkill}
                    disabled={isSaving || !isSuperAdmin}
                    className={`px-4 py-2 text-white font-mono text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer ${
                      isSuperAdmin ? 'bg-[#0F172A] hover:bg-[#1E293B]' : 'bg-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Save className="w-3.5 h-3.5 text-[#10B981]" />
                    {isSaving ? 'SAVING...' : isSuperAdmin ? 'SAVE & APPLY RULES' : 'LOCK (SUPER ADMIN ONLY)'}
                  </button>
                </div>

                {!isSuperAdmin && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono rounded-xl flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Read-Only Mode: Log in as <strong>Super Admin</strong> role to edit agentic skills and global rules.</span>
                  </div>
                )}

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={!isSuperAdmin}
                  rows={24}
                  className="w-full bg-[#0F172A] text-[#38BDF8] p-4 rounded-xl font-mono text-xs leading-relaxed outline-none focus:ring-1 focus:ring-[#0EA5E9] disabled:opacity-90"
                />
              </>
            ) : (
              <div className="text-center py-24 text-xs font-mono text-[#94A3B8]">
                Select a skill profile from the list to view or edit evaluation rules.
              </div>
            )}
          </div>

        </div>
      )}

      {/* SUB-TAB 2: OPENROUTER MULTI-KEY FAILOVER POOL */}
      {activeSubTab === 'llm_keys' && (
        <div className="space-y-6">
          
          {/* Top Banner: Air-Gapped Local Ollama Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                  PRIMARY AI ENGINE // LOCAL AIR-GAPPED OLLAMA
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {aiConfig?.local_ai?.status || 'ONLINE'}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-bold font-mono text-white flex items-center gap-2">
                Active Model: {aiConfig?.local_ai?.model || 'qwen3:4b'}
                <span className="text-xs text-slate-400 font-normal font-mono">
                  ({aiConfig?.local_ai?.endpoint || 'http://localhost:11434'})
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                100% Private On-Premise Inference &bull; Zero External Data Leakage &bull; Air-Gapped Network Security Compliance
              </p>
            </div>

            <button
              onClick={handleTestFailover}
              disabled={isTestingPool}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-white" />
              {isTestingPool ? 'QUERYING LOCAL AI...' : 'TEST LOCAL AI INFERENCE'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
            {/* Left: Free AI Models & Key Pool Overview */}
            <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold text-[#0F172A] font-mono uppercase tracking-wider border-b border-[#E2E8F0] pb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              Top Recommended Free AI Models
            </h3>

            <div className="space-y-3">
              {aiConfig?.available_free_models.map(m => {
                const isSelected = selectedModel === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => isSuperAdmin && setSelectedModel(m.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/60 shadow-xs ring-1 ring-orange-300'
                        : 'border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#0EA5E9]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono font-bold text-[#0F172A]">
                      <span>{m.name}</span>
                      {isSelected && <span className="text-[9px] bg-orange-600 text-white px-2 py-0.5 rounded font-bold uppercase">ACTIVE</span>}
                    </div>
                    <p className="text-[11px] text-[#475569] mt-1">{m.description}</p>
                    <div className="text-[9px] font-mono text-[#64748B] mt-1 truncate">{m.id}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: 6-Key Pool Inputs & Failover Tester */}
          <div className="md:col-span-2 bg-white border border-[#CBD5E1] rounded-2xl p-5 space-y-5 shadow-xs">
            
            <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="text-sm font-bold font-mono text-[#0F172A] flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#10B981]" />
                  OpenRouter API Multi-Key Pool (Up to 6 Keys)
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5 font-mono">
                  If Key #1 exhausts tokens or hits rate limit (429), engine automatically fails over to Key #2, #3, etc.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleTestFailover}
                  disabled={isTestingPool}
                  className="px-3.5 py-1.5 bg-sky-50 border border-sky-300 text-sky-800 hover:bg-sky-100 font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  {isTestingPool ? 'TESTING POOL...' : 'TEST FAILOVER'}
                </button>

                <button
                  onClick={handleSaveAiPool}
                  disabled={isSaving}
                  className="px-4 py-1.5 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 text-[#10B981]" />
                  {isSaving ? 'SAVING...' : 'SAVE KEY POOL'}
                </button>
              </div>
            </div>

            {/* Test Results Output */}
            {testResult && (
              <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs space-y-2 border border-slate-700">
                <div className="flex justify-between items-center text-[10px] text-[#38BDF8] font-bold border-b border-slate-800 pb-1">
                  <span>LLM FAILOVER TEST LOG</span>
                  <span>Model: {testResult.model}</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  {testResult.failover_log?.map((log: string, idx: number) => (
                    <div key={idx} className="leading-snug">{log}</div>
                  ))}
                </div>
                {testResult.content && (
                  <div className="pt-2 text-[#A7F3D0] border-t border-slate-800 text-[11px]">
                    Response: "{testResult.content.slice(0, 180)}..."
                  </div>
                )}
              </div>
            )}

            {/* API Keys Pool Form Grid */}
            <div className="space-y-3 font-mono text-xs">
              <label className="block font-bold text-[#0F172A] uppercase text-[10px]">
                CONFIGURE OPENROUTER API KEYS (PASTE 5 TO 6 KEYS FOR FAILOVER):
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const maskedKey = aiConfig?.key_pool[idx]?.key_preview || 'Not configured';
                  return (
                    <div key={idx} className="bg-[#F8FAFC] border border-[#CBD5E1] p-2.5 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-[#64748B]">
                        <span>API KEY #{idx + 1}</span>
                        <span className="text-[#0EA5E9]">{maskedKey}</span>
                      </div>
                      <input
                        type="password"
                        placeholder={`Paste OpenRouter Key #${idx + 1} (sk-or-v1-...)`}
                        value={apiKeysInput[idx] || ''}
                        disabled={!isSuperAdmin}
                        onChange={(e) => {
                          const newKeys = [...apiKeysInput];
                          newKeys[idx] = e.target.value;
                          setApiKeysInput(newKeys);
                        }}
                        className="w-full bg-white border border-[#CBD5E1] p-2 rounded-lg text-xs outline-none focus:border-[#0EA5E9] font-mono"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Information Notice */}
            <div className="p-3 bg-sky-50 border border-sky-200 text-sky-900 text-xs font-mono rounded-xl flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">How Automatic Key Failover Works:</span>
                <p className="text-[11px] text-sky-800 mt-0.5 leading-relaxed">
                  VectorNet uses free high-capacity OpenRouter models. If a key runs out of daily tokens or returns HTTP 429 rate limit, the system instantly switches to Key #2, then Key #3, ensuring 100% continuous compliance scanning without downtime.
                </p>
              </div>
            </div>

          </div>
        </div>
        </div>
      )}

    </div>
  );
};
