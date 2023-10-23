-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 22/10/2023 às 18:33
-- Versão do servidor: 10.4.28-MariaDB
-- Versão do PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `frota`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `manutencao`
--

CREATE TABLE `manutencao` (
  `id_manutencao` int(11) NOT NULL,
  `data` datetime NOT NULL,
  `valor_servico` float NOT NULL,
  `valor_pecas` double NOT NULL,
  `valor_total` double NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `veiculo_id_veiculo` int(11) NOT NULL,
  `oficina_id_oficina` int(11) NOT NULL,
  `pecas_id_peca` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `manutencao`
--

INSERT INTO `manutencao` (`id_manutencao`, `data`, `valor_servico`, `valor_pecas`, `valor_total`, `descricao`, `veiculo_id_veiculo`, `oficina_id_oficina`, `pecas_id_peca`) VALUES
(1, '2023-10-11 10:16:44', 10, 10, 20, 'troca de oleo ', 3, 1, 1),
(7, '2023-10-11 10:17:00', 30, 10, 40, 'troca de pastilha de freio ', 5, 1, 1),
(12, '2023-10-11 20:19:29', 12, 12, 24, 'trocar amortecedor', 3, 1, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `oficina`
--

CREATE TABLE `oficina` (
  `id_oficina` int(11) NOT NULL,
  `nome_oficina` varchar(45) NOT NULL,
  `telefone` varchar(45) NOT NULL,
  `rua` varchar(45) NOT NULL,
  `bairro` varchar(45) NOT NULL,
  `numero` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `oficina`
--

INSERT INTO `oficina` (`id_oficina`, `nome_oficina`, `telefone`, `rua`, `bairro`, `numero`) VALUES
(1, 'oficina do clebin', '14-99999-9999', 'raimundo de morais', 'sÃ£o joao', 304),
(3, 'oficina do dida', '14-99999-9999', '11 de setembro', 'gilmar torres 2', 515),
(4, 'mercedes auto center', '14-99170-7070', 'machado de assis', 'palmeiras', 5568);

-- --------------------------------------------------------

--
-- Estrutura para tabela `pecas`
--

CREATE TABLE `pecas` (
  `id_peca` int(11) NOT NULL,
  `nome_peca` varchar(45) NOT NULL,
  `fabricante_peca` varchar(45) NOT NULL,
  `preco` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `pecas`
--

INSERT INTO `pecas` (`id_peca`, `nome_peca`, `fabricante_peca`, `preco`) VALUES
(1, 'pastilha de freio', 'ford', 5);

-- --------------------------------------------------------

--
-- Estrutura para tabela `revisao`
--

CREATE TABLE `revisao` (
  `id_revisao` int(11) NOT NULL,
  `data_revisao` datetime NOT NULL,
  `valor_revisao` float NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `veiculo_id_veiculo` int(11) NOT NULL,
  `oficina_id_oficina` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `revisao`
--

INSERT INTO `revisao` (`id_revisao`, `data_revisao`, `valor_revisao`, `descricao`, `veiculo_id_veiculo`, `oficina_id_oficina`) VALUES
(2, '2023-06-29 16:13:10', 100, 'precisa de troca de Ã³leo', 3, 3),
(3, '2023-06-29 16:13:59', 100, 'precisa de troca de Ã³leo e pastilha de freio', 3, 3);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nome_usuario` varchar(45) NOT NULL,
  `login` varchar(45) NOT NULL,
  `senha` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nome_usuario`, `login`, `senha`, `email`) VALUES
(1, 'Victor ', 'victor', '1234', 'victor@gmail.com'),
(2, 'Lucas ', 'lucas', '123456', 'lucas@gmail.com'),
(4, 'Marreta', 'marreta', '123456', 'marreta@gmail.com');

-- --------------------------------------------------------

--
-- Estrutura para tabela `veiculo`
--

CREATE TABLE `veiculo` (
  `id_veiculo` int(11) NOT NULL,
  `placa` varchar(45) NOT NULL,
  `marca` varchar(45) NOT NULL,
  `combustivel` varchar(45) NOT NULL,
  `cor` varchar(45) NOT NULL,
  `usuario_id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `veiculo`
--

INSERT INTO `veiculo` (`id_veiculo`, `placa`, `marca`, `combustivel`, `cor`, `usuario_id_usuario`) VALUES
(3, 'gtx-3060', 'BMW M2', 'gasolina', 'azul', 1),
(5, 'rtx-9875', 'corsa', 'acool', 'prata', 1);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `manutencao`
--
ALTER TABLE `manutencao`
  ADD PRIMARY KEY (`id_manutencao`),
  ADD KEY `fk_manurtenção_veiculo1` (`veiculo_id_veiculo`),
  ADD KEY `fk_manurtenção_oficina1` (`oficina_id_oficina`),
  ADD KEY `fk_manurtenção_peças1` (`pecas_id_peca`);

--
-- Índices de tabela `oficina`
--
ALTER TABLE `oficina`
  ADD PRIMARY KEY (`id_oficina`);

--
-- Índices de tabela `pecas`
--
ALTER TABLE `pecas`
  ADD PRIMARY KEY (`id_peca`);

--
-- Índices de tabela `revisao`
--
ALTER TABLE `revisao`
  ADD PRIMARY KEY (`id_revisao`),
  ADD KEY `fk_revisão_veiculo1` (`veiculo_id_veiculo`),
  ADD KEY `fk_revisão_oficina1` (`oficina_id_oficina`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Índices de tabela `veiculo`
--
ALTER TABLE `veiculo`
  ADD PRIMARY KEY (`id_veiculo`),
  ADD KEY `fk_veiculo_usuario` (`usuario_id_usuario`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `manutencao`
--
ALTER TABLE `manutencao`
  MODIFY `id_manutencao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de tabela `oficina`
--
ALTER TABLE `oficina`
  MODIFY `id_oficina` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `pecas`
--
ALTER TABLE `pecas`
  MODIFY `id_peca` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `revisao`
--
ALTER TABLE `revisao`
  MODIFY `id_revisao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `veiculo`
--
ALTER TABLE `veiculo`
  MODIFY `id_veiculo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `manutencao`
--
ALTER TABLE `manutencao`
  ADD CONSTRAINT `fk_manurtenção_oficina1` FOREIGN KEY (`oficina_id_oficina`) REFERENCES `oficina` (`id_oficina`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_manurtenção_peças1` FOREIGN KEY (`pecas_id_peca`) REFERENCES `pecas` (`id_peca`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_manurtenção_veiculo1` FOREIGN KEY (`veiculo_id_veiculo`) REFERENCES `veiculo` (`id_veiculo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Restrições para tabelas `revisao`
--
ALTER TABLE `revisao`
  ADD CONSTRAINT `fk_revisão_oficina1` FOREIGN KEY (`oficina_id_oficina`) REFERENCES `oficina` (`id_oficina`),
  ADD CONSTRAINT `fk_revisão_veiculo1` FOREIGN KEY (`veiculo_id_veiculo`) REFERENCES `veiculo` (`id_veiculo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Restrições para tabelas `veiculo`
--
ALTER TABLE `veiculo`
  ADD CONSTRAINT `fk_veiculo_usuario` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
