CREATE TABLE `interactions` (
  `id` int(11) NOT NULL,
  `source` varchar(255) NOT NULL,
  `target` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `weight` int(11) NOT NULL,
  `book` tinyint(3) NOT NULL
);

ALTER TABLE `interactions`
  ADD PRIMARY KEY (`id`),
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;